from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext
import pandas as pd
import spacy
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
from dotenv import load_dotenv
from pathlib import Path  # Import Path to construct absolute paths

# Construct the absolute path to the .env file
BASE_DIR = Path(__file__).resolve().parent  # Gets chatbot directory
dotenv_path = BASE_DIR / ".env"  # Path to .env file

# Load environment variables from .env file
load_dotenv(dotenv_path=dotenv_path)
# Load spaCy model for sentence embeddings
nlp = spacy.load("en_core_web_md")

# Your Telegram Bot Token
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# Load dataset (Ensure the CSV file is in the same directory)
df = pd.read_csv("momtech_questions.csv")

# Function to get sentence embeddings using spaCy
def get_embedding(sentence):
    return nlp(sentence).vector

# Function to process user queries
def get_response(user_text):
    user_text_embedding = get_embedding(user_text.lower())  # Get embedding for user query
    similarities = []

    # Compare the user's question to each question in the CSV
    for index, row in df.iterrows():
        question_embedding = get_embedding(row["Question"].lower())  # Get embedding for question in CSV
        similarity = cosine_similarity([user_text_embedding], [question_embedding])[0][0]
        similarities.append((similarity, row["Answer"]))

    # Find the highest similarity
    max_similarity, best_answer = max(similarities, key=lambda x: x[0])

    # If similarity is high enough (threshold 0.7), return the answer, else ask to consult a professional
    if max_similarity >= 0.7:
        return best_answer
    else:
        return "Sorry, I don't have an answer for that. Please consult a professional."

# Function to handle the /start command
async def start(update: Update, context: CallbackContext):
    await update.message.reply_text("Hello! Ask me anything about postpartum care or baby care.")

# Function to handle user messages
async def handle_message(update: Update, context: CallbackContext):
    user_text = update.message.text
    response = get_response(user_text)  # Call the chatbot function
    await update.message.reply_text(response)

# Main function to run the bot
def main():
    app = Application.builder().token(TOKEN).build()
    
    # Add command and message handlers
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("🤖 Bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()

    
    # Add command and message handlers
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("🤖 Bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()
