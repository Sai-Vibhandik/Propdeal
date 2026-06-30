// AI Prompts for different sections
// IMPORTANT: These prompts must return PLAIN TEXT only, not JavaScript or JSON

const AI_PROMPTS = {
  hero: (property) => `You are a professional real estate copywriter. Generate compelling hero section content for a property listing.

Property Details:
- Name: ${property.name}
- Type: ${property.propertyType}
- Location: ${property.address?.city}, ${property.address?.state}
- Builder: ${property.builder}
- Price Range: ${property.priceRange?.min} - ${property.priceRange?.max} ${property.priceUnit}
- Category: ${property.category}

CRITICAL INSTRUCTION: Write your response as PLAIN TEXT paragraphs. Do NOT use JavaScript syntax, JSON format, square brackets [], curly braces {}, or any code. Just write normal sentences.

Write your response in this EXACT format (copy the labels exactly):

Headline: [Write a catchy headline here - maximum 60 characters]
Subheadline: [Write a brief description here - maximum 120 characters]
CTA: [Write a call-to-action text here like "Get Price Details" or "Book Site Visit"]
Badge: [Write a badge text like "New Launch" or "Ready to Move"]

Offer 1: [Write first exclusive offer text - like "No Pre-EMI till Possession"]
Offer 2: [Write second exclusive offer text]
Offer 3: [Write third exclusive offer text]
Offer Validity: [Write validity date like "31st March 2026"]

Here is an example of correct output:
Headline: Luxury Living at Prestige Lakeside
Subheadline: Experience premium apartments in Whitefield with world-class amenities and excellent connectivity
CTA: Schedule a Visit
Badge: New Launch
Offer 1: No Pre-EMI till Possession
Offer 2: Free Car Parking Worth ₹5 Lakhs
Offer 3: Early Bird Discount: 2% Off
Offer Validity: 31st March 2026

Now write your response following the same format:`,

  overview: (property) => `You are a professional real estate copywriter. Generate an overview section for a property listing.

Property Details:
- Name: ${property.name}
- Type: ${property.propertyType}
- Category: ${property.category}
- Location: ${property.address?.fullAddress}, ${property.address?.city}
- Builder: ${property.builder}
- Configurations: ${property.configurations?.join(', ')}
- Price Range: ${property.priceRange?.min} - ${property.priceRange?.max} ${property.priceUnit}
- Possession: ${property.possessionDate ? new Date(property.possessionDate).toLocaleDateString() : 'N/A'}

CRITICAL INSTRUCTION: Write your response as PLAIN TEXT. Do NOT use JavaScript syntax, JSON format, square brackets [], curly braces {}, or any code. Just write normal sentences and bullet points with hyphens.

Write your response in this EXACT format:

Description: [Write a concise paragraph about the property - 60 to 80 words maximum]

Key Points:
- [Write point 1 here]
- [Write point 2 here]
- [Write point 3 here]
- [Write point 4 here]
- [Write point 5 here]

Here is an example of correct output:
Description: Prestige Lakeside Habitat is a premium residential project by Prestige Group in Whitefield, Bangalore. Offering 2, 3, and 4 BHK apartments with world-class amenities and excellent connectivity to IT hubs. RERA registered with transparent documentation and ready for immediate possession.

Key Points:
- Modern amenities including clubhouse, swimming pool, and gym
- Excellent connectivity to major IT parks and business centers
- RERA registered project with transparent documentation
- Thoughtfully designed spaces with premium specifications
- Prime location with good social infrastructure

Now write your response following the same format:`,

  highlights: (property) => `You are a professional real estate copywriter. Generate key highlights for a property listing.

Property Details:
- Name: ${property.name}
- Type: ${property.propertyType}
- Location: ${property.address?.locality}, ${property.address?.city}
- Builder: ${property.builder}
- Category: ${property.category}

CRITICAL INSTRUCTION: Write your response as PLAIN TEXT with numbered items. Do NOT use JavaScript syntax, JSON format, square brackets [], curly braces {}, or any code. Just write numbered sentences.

IMPORTANT: Do NOT include generic highlights like "Trusted Builder", "Modern Apartments", or "Modern Design". Focus on specific property features like location advantages, amenities, possession status, infrastructure, investment potential, etc.

Write your response in this EXACT format (6 highlights):

1. [Highlight Title]: [Brief description of the highlight]
2. [Highlight Title]: [Brief description of the highlight]
3. [Highlight Title]: [Brief description of the highlight]
4. [Highlight Title]: [Brief description of the highlight]
5. [Highlight Title]: [Brief description of the highlight]
6. [Highlight Title]: [Brief description of the highlight]

Here is an example of correct output:
1. Prime Location: Strategically situated with excellent connectivity to key areas
2. Ready to Move: Immediate possession available with all amenities operational
3. Essential Amenities: Features landscaped gardens, children's play area, and parking
4. Social Infrastructure: Close proximity to schools, hospitals, and shopping centers
5. Peaceful Living: Located in a serene neighborhood away from city noise
6. Great Investment: High potential for appreciation in rapidly developing area

Now write your response following the same format (6 highlights, do NOT include builder reputation or generic design mentions):`,

  location: (property) => `You are a professional real estate copywriter. Generate connectivity description for a property listing.

Property Details:
- Name: ${property.name}
- Address: ${property.address?.fullAddress}
- Locality: ${property.address?.locality}
- City: ${property.address?.city}
- Landmark: ${property.address?.landmark || 'N/A'}

CRITICAL INSTRUCTION: Write your response as PLAIN TEXT. Do NOT use JavaScript syntax, JSON format, square brackets [], curly braces {}, or any code. Just write normal sentences.

Write your response in this EXACT format:

Connectivity: [Write a brief paragraph about connectivity including key roads, highways, metro, and transport options. Mention 2-3 key distances. Write 40-60 words ONLY.]

Here is an example of correct output:
Connectivity: The property enjoys excellent connectivity with major roads and highways nearby. The Western Express Highway is just 2 km away providing seamless access to both South Mumbai and the northern suburbs. The nearest metro station is within walking distance at 500m, while the railway station is 3 km away. Chhatrapati Shivaji International Airport is accessible within 45 minutes via the highway. Public transport is excellent with bus stops within 200m and easy availability of auto-rickshaws and cabs.

Now write your connectivity paragraph:`,

  investment: (property) => `You are a professional real estate investment advisor. Generate investment benefits for a property listing.

Property Details:
- Name: ${property.name}
- Type: ${property.propertyType}
- Location: ${property.address?.locality}, ${property.address?.city}
- Price Range: ${property.priceRange?.min} - ${property.priceRange?.max} ${property.priceUnit}
- Category: ${property.category}

CRITICAL INSTRUCTION: Write your response as PLAIN TEXT. Do NOT use JavaScript syntax, JSON format, square brackets [], curly braces {}, or any code. Just write normal sentences with hyphens for bullet points.

Write your response in this EXACT format:

Benefits:
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]
- [Benefit 4]
- [Benefit 5]

Rental Potential: [Write ONE short sentence - maximum 20 words about rental yield and demand]

Future Growth: [Write ONE short sentence - maximum 20 words about appreciation potential]

Here is an example of correct output:
Benefits:
- High rental yield of 4-5% due to prime location near IT parks
- Strong appreciation potential with upcoming infrastructure projects
- Excellent social infrastructure with schools, hospitals, and malls nearby
- Growing demand from working professionals in the area
- Trusted builder with proven track record of timely delivery

Rental Potential: 4-5% rental yield with strong demand from IT professionals working in nearby tech parks.

Future Growth: Property values expected to appreciate 15-20% over the next 3-5 years due to infrastructure development.

Now write your response following the same format:`,

  faq: (property) => `You are a professional real estate advisor. Generate FAQs for a property listing.

Property Details:
- Name: ${property.name}
- Type: ${property.propertyType}
- Location: ${property.address?.city}
- Builder: ${property.builder}
- Price Range: ${property.priceRange?.min} - ${property.priceRange?.max} ${property.priceUnit}
- Configurations: ${property.configurations?.join(', ')}
- RERA Number: ${property.reraNumber || 'N/A'}
- Possession: ${property.possessionDate ? new Date(property.possessionDate).toLocaleDateString() : 'N/A'}

CRITICAL INSTRUCTION: Write your response as PLAIN TEXT. Do NOT use JavaScript syntax, JSON format, square brackets [], curly braces {}, or any code. Just write questions and answers.

Write your response in this EXACT format (exactly 6 FAQs):

Q1: [Write the first question here]
A1: [Write a detailed answer here]

Q2: [Write the second question here]
A2: [Write a detailed answer here]

Q3: [Write the third question here]
A3: [Write a detailed answer here]

Q4: [Write the fourth question here]
A4: [Write a detailed answer here]

Q5: [Write the fifth question here]
A5: [Write a detailed answer here]

Q6: [Write the sixth question here]
A6: [Write a detailed answer here]

Here is an example of correct output:
Q1: What is the price range for this property?
A1: The price range for this property is 85 lakhs to 1.5 crores depending on the configuration and floor chosen.

Q2: Is the project RERA registered?
A2: Yes, the project is RERA registered. You can verify the registration number on the RERA website.

Now write your response following the same format (8-10 FAQs):`,

  builder: (property) => `You are a professional real estate copywriter. Generate builder information for a property listing.

Builder Details:
- Name: ${property.builder}
- Project Name: ${property.name}
- Location: ${property.address?.city}

CRITICAL INSTRUCTION: Write your response as PLAIN TEXT. Do NOT use JavaScript syntax, JSON format, square brackets [], curly braces {}, or any code. Just write normal sentences and hyphenated bullet points.

Write your response in this EXACT format:

About: [Write ONE short sentence about the builder - maximum 150 characters, 1-2 lines only]

Stats:
- [Icon: building/award/mapPin/users] | [Value: e.g., 250+] | [Label: e.g., Projects Delivered]
- [Icon: building/award/mapPin/users] | [Value: e.g., 30+] | [Label: e.g., Years of Experience]
- [Icon: building/award/mapPin/users] | [Value: e.g., 15+] | [Label: e.g., Cities Presence]
- [Icon: building/award/mapPin/users] | [Value: e.g., 10,000+] | [Label: e.g., Happy Customers]

Key Facts:
- [Fact 1 - Why choose this builder]
- [Fact 2 - Why choose this builder]
- [Fact 3 - Why choose this builder]
- [Fact 4 - Why choose this builder]
- [Fact 5 - Why choose this builder]
- [Fact 6 - Why choose this builder]

Here is an example of correct output:
About: A renowned developer known for quality construction and timely delivery with decades of experience.

Stats:
- award | 30+ | Years of Experience
- building | 250+ | Projects Delivered
- mapPin | 15+ | Cities Presence
- users | 50,000+ | Happy Customers

Key Facts:
- RERA registered and compliant projects
- On-time delivery with quality construction
- Transparent pricing with no hidden charges
- Excellent after-sales service
- Prime location selection for all projects
- Modern amenities and premium specifications

Now write your response following the same format:`,

  seo: (property) => `You are an SEO expert specializing in real estate. Generate SEO content for a property listing.

Property Details:
- Name: ${property.name}
- Type: ${property.propertyType}
- Location: ${property.address?.locality}, ${property.address?.city}
- Builder: ${property.builder}
- Configurations: ${property.configurations?.join(', ')}

CRITICAL INSTRUCTION: Write your response as PLAIN TEXT. Do NOT use JavaScript syntax, JSON format, square brackets [], curly braces {}, or any code. Just write normal sentences with comma-separated keywords.

Write your response in this EXACT format:

Title: [Write an SEO optimized title here - maximum 60 characters]

Description: [Write a meta description here - maximum 160 characters]

Keywords: [keyword1], [keyword2], [keyword3], [keyword4], [keyword5], [keyword6], [keyword7], [keyword8], [keyword9], [keyword10]

Here is an example of correct output:
Title: Prestige Lakeside Habitat | 2/3/4 BHK Apartments in Whitefield, Bangalore

Description: Premium apartments in Whitefield by Prestige Group. Ready to move with world-class amenities. Starting 85 lakhs. Book your site visit today.

Keywords: Prestige Lakeside Habitat, Flats in Whitefield, Apartments in Bangalore, Prestige Group, 2 BHK in Whitefield, 3 BHK in Whitefield, Ready to move flats, Luxury apartments Bangalore

Now write your response following the same format:`,
};

export default AI_PROMPTS;