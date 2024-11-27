import os
import shutil
import xml.etree.ElementTree as ET

# Define cotton pest categories and their IDs
cotton_pest_categories = {
    'aphids': "25",
    'armyworm': "24",
    'mites': "22",
    'whiteflies': "72",
    'thrips': "55",
    'cutworms': ["19", "21"]
}

# Paths
annotations_dir = r"D:\IP data\Annotations"  # Replace with the actual path to your XML files
images_dir = r"D:\IP data\images\JPEGImages"  # Replace with the actual path to your image files
output_dir = r"D:\IP data\cotton_pests"  # Replace with the desired output directory

# Create output directories for each pest
for pest in cotton_pest_categories:
    pest_dir = os.path.join(output_dir, pest)
    os.makedirs(pest_dir, exist_ok=True)

# Parse XML files and filter images
for annotation_file in os.listdir(annotations_dir):
    if annotation_file.endswith(".xml"):
        annotation_path = os.path.join(annotations_dir, annotation_file)
        
        try:
            tree = ET.parse(annotation_path)
            root = tree.getroot()

            # Extract category ID from the <name> tag
            category_id = root.find(".//object/name").text  # XPath to find <name> inside <object>

            # Check if category ID matches any cotton pest category
            for pest, category_ids in cotton_pest_categories.items():
                if not isinstance(category_ids, list):
                    category_ids = [category_ids]
                
                if category_id in category_ids:
                    # Copy the corresponding image
                    image_name = os.path.splitext(annotation_file)[0] + ".jpg"
                    source_path = os.path.join(images_dir, image_name)
                    target_path = os.path.join(output_dir, pest, image_name)
                    
                    if os.path.exists(source_path):
                        shutil.copy(source_path, target_path)
                    else:
                        print(f"Warning: Image {source_path} not found!")
                    break  # No need to check other pests for the same file

        except ET.ParseError:
            print(f"Error parsing XML file: {annotation_path}")
        except Exception as e:
            print(f"Error processing file {annotation_file}: {e}")

print("Cotton pest dataset extraction complete!")
