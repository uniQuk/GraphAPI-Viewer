import os
import requests
import datetime

GITHUB_API_URL = "https://api.github.com/repos/microsoftgraph/msgraph-sdk-powershell/contents/openApiDocs"
LOCAL_OPENAPI_DIR = os.path.join(os.path.dirname(__file__), "..", "openapi")
BACKUP_DIR = os.path.join(LOCAL_OPENAPI_DIR, "backup")


def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)


def get_remote_files(folder):
    url = f"{GITHUB_API_URL}/{folder}"
    print(f"Fetching from: {url}")
    resp = requests.get(url)
    print(f"Response code: {resp.status_code}")
    if resp.status_code != 200:
        print(f"Error fetching {url}: {resp.text}")
        return []
    try:
        files = [
            item for item in resp.json()
            if item.get("type") == "file" and item["name"].endswith(".yml")
        ]
    except ValueError:
        print(f"Error: Response is not valid JSON. Response: {resp.text}")
        return []
    print(f"Found {len(files)} files matching criteria")
    return files


def download_file(remote_url, local_path):
    file_resp = requests.get(remote_url)
    with open(local_path, "wb") as f:
        f.write(file_resp.content)


def update_folder(folder):
    folder_path = os.path.join(LOCAL_OPENAPI_DIR, folder)
    ensure_dir(folder_path)
    remote_files = get_remote_files(folder)

    if not remote_files:
        print(f"No files found in the remote '{folder}' folder.")
        return

    updated_files = []
    for item in remote_files:
        filename = item["name"]
        local_file_path = os.path.join(folder_path, filename)
        remote_url = item["download_url"]

        # Download remote content for comparison
        remote_content = requests.get(remote_url).content
        if os.path.exists(local_file_path):
            with open(local_file_path, "rb") as lf:
                local_content = lf.read()
            if local_content != remote_content:
                # Backup the old file
                datestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                backup_name = f"{filename}.{datestamp}"
                ensure_dir(BACKUP_DIR)
                os.rename(local_file_path, os.path.join(BACKUP_DIR, backup_name))
                # Update the file
                download_file(remote_url, local_file_path)
                updated_files.append(filename)
        else:
            # Download new file
            download_file(remote_url, local_file_path)
            updated_files.append(filename)

    # Print status
    if updated_files:
        print(f"Updated files in '{folder}':")
        for fname in updated_files:
            print(f"  - {fname}")
    else:
        print(f"No updates needed for '{folder}'.")


def main():
    print("Checking 'beta' folder...")
    update_folder("beta")
    print("\nChecking 'v1.0' folder...")
    update_folder("v1.0")


if __name__ == "__main__":
    main()