import bs4
import requests
from urllib.parse import urlparse, urljoin

def extract_text_and_follow_links(url, depth, max_depth, visited_urls):
    if depth > max_depth or url in visited_urls:
        return

    print(f"Processing depth {depth} - URL: {url}")

    # Exclude non-HTTP/HTTPS links
    if not (url.startswith('http://') or url.startswith('https://')):
        print(f"Skipping non-HTTP/HTTPS URL: {url}")
        visited_urls.add(url)
        return

    # Get the HTML of the website
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Error accessing URL: {url}")
        visited_urls.add(url)
        return

    # Parse the HTML with BeautifulSoup
    soup = bs4.BeautifulSoup(response.content, "html.parser")

    # Extract all text from the HTML
    text = soup.find_all(text=True)

    # Append the text to a text file
    with open("pages.txt", "a") as f:
        for line in text:
            f.write(line + "\n")

    # Mark URL as visited
    visited_urls.add(url)

    # Close the response
    response.close()

    # Follow links and process recursively
    if depth < max_depth:
        for link in soup.find_all('a', href=True):
            new_url = urljoin(url, link['href'])
            extract_text_and_follow_links(new_url, depth + 1, max_depth, visited_urls)

# Input URL and tree height
url = input("Enter a URL: ")
tree_height = int(input("Enter tree height: "))

# Initialize visited URLs set
visited_urls = set()

# Start the process
extract_text_and_follow_links(url, 1, tree_height, visited_urls)

print("Operation completed.")
