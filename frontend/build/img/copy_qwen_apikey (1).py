import json
import os

def update_api_key():
    """
    Reads the access token from the JSON file located at
    /Users/ghufran/.qwen/oauth_creds.json and updates the api_key
    value in the Providers array of /Users/ghufran/.claude-code-router/config.json
    """
    oauth_file_path = "/Users/ghufran/.qwen/oauth_creds.json"
    config_file_path = "/Users/ghufran/.claude-code-router/config.json"

    try:
        # Check if the oauth file exists
        if not os.path.exists(oauth_file_path):
            print(f"Error: OAuth credentials file does not exist at {oauth_file_path}")
            return False

        # Read the OAuth credentials file
        with open(oauth_file_path, 'r') as file:
            oauth_data = json.load(file)

        # Extract the access_token
        access_token = oauth_data.get('access_token')

        if not access_token:
            print("Error: 'access_token' key not found in the OAuth credentials file")
            return False

        # Check if the config file exists
        if not os.path.exists(config_file_path):
            print(f"Error: Config file does not exist at {config_file_path}")
            return False

        # Read the config file
        with open(config_file_path, 'r') as file:
            config_data = json.load(file)

        # Find and update the api_key in the Providers array
        providers = config_data.get('Providers', [])
        api_key_updated = False

        for provider in providers:
            if 'api_key' in provider:
                provider['api_key'] = access_token
                api_key_updated = True
                print(f"Updated api_key for provider: {provider.get('name', 'Unknown')}")

        if not api_key_updated:
            print("Warning: No provider with an 'api_key' field was found in the config file")
            return False

        # Write the updated data back to the config file
        with open(config_file_path, 'w') as file:
            json.dump(config_data, file, indent=2)

        print(f"Successfully updated api_key(s) in {config_file_path} with access token from {oauth_file_path}")
        return True

    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format in file - {str(e)}")
        return False
    except PermissionError as e:
        print(f"Error: Permission denied to read/write file - {str(e)}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return False

if __name__ == "__main__":
    update_api_key()