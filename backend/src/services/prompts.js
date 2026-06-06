// AI Prompts for different sections
const AI_PROMPTS = {
  hero: (property) => `You are a professional real estate copywriter. Generate compelling hero section content for a property listing.

Property Details:
- Name: ${property.name}
- Type: ${property.propertyType}
- Location: ${property.address?.city}, ${property.address?.state}
- Builder: ${property.builder}
- Price Range: ${property.priceRange?.min} - ${property.priceRange?.max} ${property.priceUnit}

Generate:
1. Headline: A catchy, attention-grabbing headline (max 60 characters)
2. Subheadline: A brief description highlighting key selling points (max 120 characters)
3. CTA: A call-to-action text (e.g., "Get Price Details", "Book Site Visit")

Format your response as:
Headline: [your headline]
Subheadline: [your subheadline]
CTA: [your cta text]`,

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

Generate:
1. Description: A detailed paragraph about the property (150-200 words)
2. Key Points: 5 bullet points highlighting unique features

Format your response as:
Description: [your description]

Key Points:
- [point 1]
- [point 2]
- [point 3]
- [point 4]
- [point 5]`,

  highlights: (property) => `You are a professional real estate copywriter. Generate key highlights for a property listing.

Property Details:
- Name: ${property.name}
- Type: ${property.propertyType}
- Location: ${property.address?.locality}, ${property.address?.city}
- Builder: ${property.builder}
- Category: ${property.category}

Generate 8 key highlights with titles and descriptions. Focus on:
- Location advantages
- Amenities
- Builder reputation
- Investment potential
- Lifestyle benefits

Format your response as:
1. [Highlight Title]: [Brief description]
2. [Highlight Title]: [Brief description]
... (8 highlights total)`,

  location: (property) => `You are a professional real estate copywriter. Generate location advantages for a property listing.

Property Details:
- Name: ${property.name}
- Address: ${property.address?.fullAddress}
- Locality: ${property.address?.locality}
- City: ${property.address?.city}
- Landmark: ${property.address?.landmark || 'N/A'}

Generate:
1. Connectivity: A paragraph about connectivity (roads, metro, airport, etc.)
2. Nearby Places: List of 10 important nearby places with distances

Format your response as:
Connectivity: [connectivity paragraph]

Nearby Places:
- [Place Name] - [Distance] - [Type: School/Hospital/Mall/IT Hub/etc.]
... (10 places total)`,

  investment: (property) => `You are a professional real estate investment advisor. Generate investment benefits for a property listing.

Property Details:
- Name: ${property.name}
- Type: ${property.propertyType}
- Location: ${property.address?.locality}, ${property.address?.city}
- Price Range: ${property.priceRange?.min} - ${property.priceRange?.max} ${property.priceUnit}
- Category: ${property.category}

Generate:
1. 5 Key Investment Benefits
2. Rental Potential Analysis
3. Future Growth Prospects

Format your response as:
Benefits:
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]
- [Benefit 4]
- [Benefit 5]

Rental Potential: [paragraph about rental yields and demand]

Future Growth: [paragraph about appreciation potential]`,

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

Generate 8-10 frequently asked questions with detailed answers covering:
- Pricing and payment plans
- Possession timeline
- Amenities
- Location and connectivity
- Legal and documentation
- Builder background
- Loan and financing options

Format your response as:
Q1: [Question]
A1: [Detailed Answer]

Q2: [Question]
A2: [Detailed Answer]
... (8-10 FAQs total)`,

  builder: (property) => `You are a professional real estate researcher. Generate builder information for a property listing.

Builder Details:
- Name: ${property.builder}
- Project Name: ${property.name}
- Location: ${property.address?.city}

Generate:
1. About the Builder (100-150 words)
2. Years of Experience
3. Total Projects Completed
4. Key Facts about the builder

Format your response as:
About: [About paragraph]

Experience: [Years]

Total Projects: [Number]

Key Facts:
- [Fact 1]
- [Fact 2]
- [Fact 3]
- [Fact 4]
- [Fact 5]`,

  seo: (property) => `You are an SEO expert specializing in real estate. Generate SEO content for a property listing.

Property Details:
- Name: ${property.name}
- Type: ${property.propertyType}
- Location: ${property.address?.locality}, ${property.address?.city}
- Builder: ${property.builder}
- Configurations: ${property.configurations?.join(', ')}

Generate:
1. Meta Title (max 60 characters)
2. Meta Description (max 160 characters)
3. Keywords (10-15 relevant keywords)

Format your response as:
Title: [SEO optimized title]

Description: [Meta description]

Keywords: [keyword1], [keyword2], [keyword3], ...`,
};

export default AI_PROMPTS;