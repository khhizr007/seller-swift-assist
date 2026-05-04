// Generate Meesho-ready listing (images + text) from a product photo
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Body = {
  imageBase64: string; // data URL
  category?: string;
  notes?: string;
};

async function callAI(payload: Record<string, unknown>) {
  const r = await fetch(AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text();
    const err: any = new Error(`AI error ${r.status}: ${text}`);
    err.status = r.status;
    throw err;
  }
  return r.json();
}

const IMAGE_PROMPTS = [
  "Transform this into a high-quality ecommerce product image with a clean pure white background, soft natural shadows, professional studio lighting, sharp focus, realistic textures and colors, centered composition, optimized for Indian ecommerce marketplaces like Meesho. Keep the product identical — do not change its design, color, or shape.",
  "Place this exact product in a bright, relatable Indian home setting (warm daylight, simple modern Indian decor). Lifestyle catalog style suitable for Meesho. Keep the product identical in design, color and shape. Photoreal, eye-catching, vibrant but natural.",
  "Create a vibrant Meesho-style PRODUCT INFOGRAPHIC image (square, 1:1). Place this exact product centered on a clean light background (white or very soft pastel). Around the product, add 4-5 short feature callouts with thin connecting lines/arrows pointing to relevant parts of the product. Each callout should be a SHORT benefit or attribute in simple English (2-4 words max), e.g. 'Premium Fabric', 'Lightweight', 'Easy Wash', 'Trendy Design', 'Best Quality'. Use bold, highly legible sans-serif text in dark color, with small colorful icon accents (checkmarks, stars, sparkles) in Meesho pink/magenta (#F43397) and complementary colors. Keep typography crisp and perfectly spelled — no gibberish text. Modern Indian ecommerce marketing style, mobile-friendly, eye-catching. Do NOT alter the product's design, color, or shape.",
];

async function generateImage(instruction: string, imageDataUrl: string, model = "google/gemini-2.5-flash-image"): Promise<string | null> {
  const data = await callAI({
    model,
    modalities: ["image", "text"],
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: instruction },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ],
      },
    ],
  });
  const url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  return url ?? null;
}

async function generateListing(imageDataUrl: string, category?: string, notes?: string) {
  const tools = [
    {
      type: "function",
      function: {
        name: "create_meesho_listing",
        description: "Create an optimized Meesho product listing.",
        parameters: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description:
                "Meesho-style title under 80 chars. Format: '[Product] for Women/Men | Latest Design | [Material/Feature] | Combo info'. Include trending words like 'Stylish', 'Latest', 'Trendy' when natural.",
            },
            description: {
              type: "string",
              description: "Friendly simple-English paragraph (60-100 words) for Indian buyers, benefits-focused.",
            },
            bullets: {
              type: "array",
              items: { type: "string" },
              minItems: 4,
              maxItems: 6,
              description: "4-6 short benefit bullets, mobile-friendly.",
            },
            category: { type: "string", description: "Detected Meesho category, e.g. 'Women Kurtis', 'Watches'." },
            tags: {
              type: "array",
              items: { type: "string" },
              minItems: 5,
              maxItems: 10,
              description: "5-10 search keywords.",
            },
            suggestedPriceInr: {
              type: "object",
              properties: {
                min: { type: "number" },
                max: { type: "number" },
              },
              required: ["min", "max"],
            },
            attributes: {
              type: "object",
              description: "Key attributes detected (material, color, pattern, occasion, etc.)",
              additionalProperties: { type: "string" },
            },
          },
          required: ["title", "description", "bullets", "category", "tags", "suggestedPriceInr", "attributes"],
          additionalProperties: false,
        },
      },
    },
  ];

  const userText = `Analyze the product in this image and create a Meesho-optimized listing.${
    category ? ` Seller hint — category: ${category}.` : ""
  }${notes ? ` Notes: ${notes}.` : ""} Tone: simple English, mobile-first, benefits-driven, suitable for value-conscious Indian shoppers.`;

  const data = await callAI({
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "You are an expert Meesho listing copywriter for Indian sellers. Always return concise, mobile-friendly content optimized for Meesho's catalog and search.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: userText },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ],
      },
    ],
    tools,
    tool_choice: { type: "function", function: { name: "create_meesho_listing" } },
  });

  const call = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error("No listing returned");
  return JSON.parse(call.function.arguments);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    const body = (await req.json()) as Body;
    if (!body?.imageBase64?.startsWith("data:image/")) {
      return new Response(JSON.stringify({ error: "imageBase64 must be a data URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Run listing + 3 image variants in parallel.
    // Use higher-quality image model for the infographic (index 2) for legible text.
    const [listing, ...images] = await Promise.all([
      generateListing(body.imageBase64, body.category, body.notes),
      ...IMAGE_PROMPTS.map((p, i) =>
        generateImage(
          p,
          body.imageBase64,
          i === 2 ? "google/gemini-3.1-flash-image-preview" : "google/gemini-2.5-flash-image"
        ).catch((e) => {
          console.error("image gen failed:", e);
          return null;
        })
      ),
    ]);

    return new Response(
      JSON.stringify({
        listing,
        images: images.filter(Boolean),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error("generate-listing error:", e);
    const status = e?.status === 429 ? 429 : e?.status === 402 ? 402 : 500;
    const message =
      status === 429
        ? "Rate limit reached. Please wait a moment and try again."
        : status === 402
        ? "AI credits exhausted. Please add credits in Settings → Workspace → Usage."
        : e?.message || "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
