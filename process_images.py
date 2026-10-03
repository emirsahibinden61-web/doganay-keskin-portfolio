import os
from PIL import Image, ImageEnhance, ImageFilter

os.makedirs("public/images", exist_ok=True)
os.makedirs("public/videos", exist_ok=True)
os.makedirs("public/uploads", exist_ok=True)
os.makedirs("data", exist_ok=True)

img_path = "dogi.jpg"
if os.path.exists(img_path):
    img = Image.open(img_path).convert("RGB")
    width, height = img.size
    print(f"Original size: {width}x{height}")

    # 1. High quality full copy
    img.save("public/images/dogi-original.jpg", quality=95)

    # 2. Cinematic graded full
    enhancer_contrast = ImageEnhance.Contrast(img)
    contrast_img = enhancer_contrast.enhance(1.08)
    enhancer_color = ImageEnhance.Color(contrast_img)
    cinematic_full = enhancer_color.enhance(1.12)
    enhancer_sharp = ImageEnhance.Sharpness(cinematic_full)
    cinematic_full = enhancer_sharp.enhance(1.1)
    cinematic_full.save("public/images/dogi-cinematic.jpg", quality=92)

    # 3. Portrait crop: Doğanay is centered around x ~ 0.35 to 0.70, y ~ 0.40 to 0.90
    # Let's crop upper body & face (from sunglasses down to waist)
    # Head is around y: 700-1100, x: 550-900
    box_portrait = (
        int(width * 0.28),
        int(height * 0.38),
        int(width * 0.76),
        int(height * 0.85)
    )
    portrait = img.crop(box_portrait)
    portrait_contrast = ImageEnhance.Contrast(portrait).enhance(1.1)
    portrait_color = ImageEnhance.Color(portrait_contrast).enhance(1.15)
    portrait_sharp = ImageEnhance.Sharpness(portrait_color).enhance(1.15)
    portrait_sharp.save("public/images/dogi-portrait.jpg", quality=95)

    # 4. Close-up avatar
    box_avatar = (
        int(width * 0.40),
        int(height * 0.40),
        int(width * 0.62),
        int(height * 0.58)
    )
    avatar = img.crop(box_avatar)
    avatar_contrast = ImageEnhance.Contrast(avatar).enhance(1.15)
    avatar_color = ImageEnhance.Color(avatar_contrast).enhance(1.1)
    avatar_sharp = ImageEnhance.Sharpness(avatar_color).enhance(1.2)
    avatar_sharp.save("public/images/dogi-avatar.jpg", quality=95)

    # 5. Hero widescreen crop with Doğanay and the car/background
    box_hero = (
        0,
        int(height * 0.25),
        width,
        int(height * 0.88)
    )
    hero = img.crop(box_hero)
    hero = ImageEnhance.Contrast(hero).enhance(1.08)
    hero.save("public/images/dogi-hero.jpg", quality=92)

    print("All image versions created successfully in public/images/")
else:
    print("dogi.jpg not found!")
