const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");

let base64Image = "";

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        base64Image = reader.result;
        preview.src = base64Image;
        preview.style.display = "block";
    };

    reader.readAsDataURL(file);
});

async function analyzeImage() {
    if (!base64Image) {
        alert("Upload an image first");
        return;
    }

    result.value = "Analyzing image...";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze this image and generate a highly detailed image generation prompt. Match texture, lighting, colors, environment, composition, camera angle, depth, realism, and style with maximum accuracy."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: base64Image
                            }
                        }
                    ]
                }
            ],
            max_tokens: 400
        })
    });

    const data = await response.json();
    result.value = data.choices[0].message.content;
}