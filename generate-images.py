#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate unique photorealistic images for Numerology Hub Blog
"""

import os
import sys
import json
import time
from pathlib import Path
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def save_image(file_name, data):
    """Save binary data to a file"""
    with open(file_name, "wb") as f:
        f.write(data)
    print(f"✅ Saved: {file_name}")

def retry_generate_image(client, model, prompt, max_retries=5):
    """Generate image with retry logic"""
    for attempt in range(max_retries):
        try:
            contents = [
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=prompt)],
                ),
            ]
            
            config = types.GenerateContentConfig(
                response_modalities=["IMAGE"],
            )
            
            for chunk in client.models.generate_content_stream(
                model=model,
                contents=contents,
                config=config,
            ):
                if (chunk.candidates and 
                    chunk.candidates[0].content and 
                    chunk.candidates[0].content.parts):
                    
                    if (chunk.candidates[0].content.parts[0].inline_data and
                        chunk.candidates[0].content.parts[0].inline_data.data):
                        return chunk.candidates[0].content.parts[0].inline_data.data
            
            return None
            
        except Exception as e:
            if '503' in str(e) or '429' in str(e):
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt
                    print(f"⏳ Rate limited, waiting {wait_time}s... (attempt {attempt+1}/{max_retries})")
                    time.sleep(wait_time)
                else:
                    raise
            else:
                raise

def generate_author_image(client, model):
    """Generate author profile image"""
    print("\n👤 Generating author profile image...")
    
    prompt = """Create a professional, friendly headshot photo of a numerology expert and spiritual guide.

Details:
- Young adult woman (25-35 years old)
- Warm, approachable appearance
- Mystical but professional vibe
- Soft, natural lighting
- Warm, friendly smile
- Subtle spiritual elements in background (crystals, numerology charts, or mystical symbols in soft focus)
- Good lighting, professional photography quality
- Authentic, relatable expression
- Photorealistic portrait style
- NO text, logos, or brand names

Style: Professional headshot photography, natural lighting, authentic expression, mystical but accessible"""

    try:
        image_data = retry_generate_image(client, model, prompt)
        if image_data:
            save_image("images/author.png", image_data)
            print("✅ Author image generated")
        else:
            print("⚠️  No image data received for author")
    except Exception as e:
        print(f"❌ Error generating author image: {e}")

def generate_blog_images(client, model):
    """Generate images for all blog posts"""
    # Load content
    with open('content.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    posts = data['posts']
    print(f"\n🎨 Generating {len(posts)} unique blog post images...")
    
    # Image prompts for each post
    image_prompts = {
        "life-path-number-guide": """Photorealistic, cinematic image, 16:9 aspect ratio. A mystical yet modern scene showing numerology in action. A person's hands (diverse, could be any gender) are writing numbers and calculations on a beautiful, aged parchment paper with a vintage fountain pen. The paper shows a birth date calculation: "12/25/1985" with arrows and mathematical reductions leading to a single digit. Soft, warm golden hour lighting streams through a window, illuminating floating dust particles. In the background, subtle mystical elements: a crystal ball reflecting light, ancient numerology charts on the wall (out of focus), and a compass rose. The atmosphere is peaceful, spiritual, and intellectual. Rich textures: aged paper, wooden desk, soft fabric. Absolutely NO text, NO logos, NO brand names visible anywhere. Professional photography quality, cinematic depth of field.""",
        
        "lucky-numbers-date-of-birth": """Photorealistic, cinematic image, 16:9 aspect ratio. A beautiful, diverse person (20s-40s, any gender) holding a smartphone displaying a birth date calculator app interface (generic, no real app logos). They're sitting in a cozy, modern room with soft natural lighting. The phone screen shows colorful numbers and a birth date being calculated. In the background, subtle numerology symbols and lucky number charms (horseshoe, four-leaf clover, etc.) arranged artistically on a shelf. The person has a curious, hopeful expression. Warm, inviting atmosphere. Rich textures: soft fabrics, natural wood, modern technology. Absolutely NO text, NO logos, NO brand names visible anywhere. Professional photography quality, cinematic composition.""",
        
        "master-numbers-numerology": """Photorealistic, cinematic image, 16:9 aspect ratio. A powerful, mystical scene showing the numbers 11, 22, and 33 glowing with ethereal light. The numbers are displayed on an ancient stone tablet or carved into mystical crystals, with soft, otherworldly illumination emanating from them. The scene is set in a dimly lit, sacred space with dramatic lighting. Subtle mystical elements: geometric patterns, sacred geometry, and spiritual symbols in the background (soft focus). The atmosphere is profound, spiritual, and awe-inspiring. Rich textures: stone, crystal, ethereal light. Deep, mystical color palette with purples, golds, and blues. Absolutely NO text, NO logos, NO brand names visible anywhere. Professional photography quality, cinematic depth of field.""",
        
        "expression-number-calculation": """Photorealistic, cinematic image, 16:9 aspect ratio. A person's hands (diverse, any gender) writing their full name in elegant calligraphy on beautiful paper. The name is being converted to numbers using a numerology chart visible nearby. A vintage numerology alphabet chart (Pythagorean system) is partially visible, showing letter-to-number conversions. Soft, warm lighting from a desk lamp. The scene is peaceful and focused, showing the process of discovering one's Expression Number. Rich textures: paper, ink, wood, fabric. Warm, inviting atmosphere. Absolutely NO text, NO logos, NO brand names visible anywhere. Professional photography quality, cinematic composition.""",
        
        "lucky-numbers-different-purposes": """Photorealistic, cinematic image, 16:9 aspect ratio. A diverse, modern person (20s-40s, any gender) surrounded by three distinct visual elements representing love, career, and wealth. On the left: romantic symbols (heart, couple's silhouette in soft focus). Center: professional success symbols (briefcase, upward arrow, achievement). Right: abundance symbols (coins, prosperity symbols). The person is in the center, looking confident and hopeful, with numbers floating around them like magical elements. Soft, golden hour lighting. Modern, clean background. The atmosphere is aspirational and positive. Rich textures: modern fabrics, natural elements, soft lighting. Absolutely NO text, NO logos, NO brand names visible anywhere. Professional photography quality, cinematic depth of field.""",
        
        "numerology-compatibility": """Photorealistic, cinematic image, 16:9 aspect ratio. Two diverse people (any genders, 20s-40s) sitting together, looking at a numerology compatibility chart displayed on a tablet or paper. They're in a cozy, modern setting with warm lighting. The chart shows their Life Path Numbers and compatibility analysis. The couple appears happy and connected, with subtle romantic elements (soft focus hearts, connection symbols) in the background. The atmosphere is warm, loving, and harmonious. Rich textures: modern technology, soft fabrics, natural wood. Warm, inviting color palette. Absolutely NO text, NO logos, NO brand names visible anywhere. Professional photography quality, cinematic composition."""
    }
    
    for post in posts:
        title = post['title']
        slug = post['slug']
        
        # Get prompt for this post
        prompt = image_prompts.get(slug, f"""Photorealistic, cinematic image, 16:9 aspect ratio. A mystical, spiritual scene related to numerology and lucky numbers. Peaceful, professional atmosphere with warm lighting. Rich textures and cinematic depth. Absolutely NO text, NO logos, NO brand names visible anywhere.""")
        
        print(f"\n📸 Generating image for: {title}")
        
        try:
            image_data = retry_generate_image(client, model, prompt)
            if image_data:
                filename = f"images/{slug}.png"
                save_image(filename, image_data)
            else:
                print(f"⚠️  No image data received for: {title}")
                
        except Exception as e:
            print(f"❌ Error generating image for {title}: {e}")
            continue

def main():
    # Check API key
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY or GOOGLE_API_KEY environment variable not set")
        print("Please set your API key in .env file")
        return
    
    print("🔮 Numerology Hub - Image Generator")
    print("=" * 50)
    
    # Create images directory
    os.makedirs("images", exist_ok=True)
    
    # Initialize client
    client = genai.Client(api_key=api_key)
    model = "gemini-2.5-flash-image"
    
    # Generate author image
    generate_author_image(client, model)
    
    # Generate blog post images
    generate_blog_images(client, model)
    
    print("\n" + "=" * 50)
    print("✅ All images generated successfully!")
    print("\nNext step: npm run build && npm run deploy")

if __name__ == "__main__":
    main()

