import sys
import json
import spacy
import nltk
from spacy import load

# Add your virtual environment path
sys.path.append('/Users/deepatamraparani/.pyenv/versions/n8n_env/lib/python3.10/site-packages')

# Initialize spaCy and NLTK with a larger model
nlp = load("en_core_web_lg")  # Ensure the model is downloaded
nltk.download('stopwords')
stop_words = set(nltk.corpus.stopwords.words('english'))

# Custom stop words
custom_stop_words = {'suggest', 'me', 'a', 'the', 'is', 'it', 'that', 'for', 'in', 'to'}
stop_words = stop_words.union(custom_stop_words)

# List of categories
categories = [
    "electronics", "appliances", "clothing", "accessories", "furniture",
    "tools", "toys", "home", "garden", "kitchen", "sports", "outdoor",
    "vehicle", "pet", "baby", "beauty", "health"
]

def extract_keywords(doc):
    # This function extracts relevant keywords from the processed document
    keywords = []
    for token in doc:
        # Filter for nouns, proper nouns, and adjectives
        if (token.pos_ in ('NOUN', 'PROPN', 'ADJ') and
            token.text.lower() not in stop_words and
            len(token.text) > 2):
            keywords.append(token.text)

    return keywords

def find_closest_match(text, categories):
    doc = nlp(text)
    max_distance = 0  # Start with 0 for maximum similarity
    closest_category = None
    closest_keywords = []

    for category in categories:
        category_doc = nlp(category)
        distance = doc.similarity(category_doc)  # Measure similarity

        # Update if we find a closer category
        if distance > max_distance:
            max_distance = distance
            closest_category = category
            # Extract keywords using the new function
            closest_keywords = extract_keywords(doc)

    return closest_category, closest_keywords

# Get input from the command line arguments
user_input = sys.argv[1]

# Process the input
closest_category, keywords = find_closest_match(user_input, categories)

# Return the results as JSON
output = {
    'userCategory': closest_category if closest_category else None,
    'keywords': keywords if keywords else [],
    'originalInput': user_input
}

print(json.dumps(output))
