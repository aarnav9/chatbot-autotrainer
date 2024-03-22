import bs4
import requests

url = input("Enter a URL: ")

# Get the HTML of the website
response = requests.get(url)

# Parse the HTML with BeautifulSoup
soup = bs4.BeautifulSoup(response.content, "html.parser")

# Extract all text from the HTML
text = soup.find_all(text=True)

# Append the text to a text file
with open("pages.txt", "w") as f:
    for line in text:
        f.write(line + "\n")

# Close the response
response.close()
