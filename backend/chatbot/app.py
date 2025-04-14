import pandas as pd
import re

def remove_space_after_comma_line(line):
  """Removes a single space immediately following a comma in a line."""
  return re.sub(r",\s+", ",", line)

def correct_csv_error_with_space_removal(input_filename, output_filename, error_line_numbers):
    """
    Attempts to correct a pandas.errors.ParserError in a CSV file
    by ensuring the specified error lines have exactly two fields separated by a comma
    and removes spaces after commas.

    Args:
        input_filename (str): The name of the input CSV file.
        output_filename (str): The name of the output CSV file with the corrected lines.
        error_line_numbers (list): A list of line numbers (1-based) where the error occurred.
    """
    try:
        with open(input_filename, 'r') as infile, open(output_filename, 'w') as outfile:
            for i, line in enumerate(infile, 1):
                modified_line = line
                if i in error_line_numbers:
                    modified_line = remove_space_after_comma_line(line)
                    fields = modified_line.strip().split(',')
                    num_fields = len(fields)

                    if num_fields > 2:
                        corrected_line = f"{fields[0].strip()},{','.join(fields[1:]).strip()}\n"
                        outfile.write(corrected_line)
                        print(f"Corrected line {i} (space removed, merged fields): {corrected_line.strip()}")
                    elif num_fields < 2:
                        corrected_line = f"{modified_line.strip()}, \n"
                        outfile.write(corrected_line)
                        print(f"Corrected line {i} (space removed, added missing field): {corrected_line.strip()}")
                    else:
                        outfile.write(modified_line)
                        print(f"Corrected line {i} (space removed): {modified_line.strip()}")
                else:
                    outfile.write(modified_line)

        print(f"Attempted correction with space removal. Check '{output_filename}'.")

    except FileNotFoundError:
        print(f"Error: Input file '{input_filename}' not found.")
    except Exception as e:
        print(f"An error occurred during processing: {e}")

if __name__ == "__main__":
    input_file = "momtech_questions.csv"
    output_file = "momtech_questions_corrected_space.csv"
    error_lines = [142]  # Replace with the actual error line numbers you found

    correct_csv_error_with_space_removal(input_file, output_file, error_lines)

    try:
        df = pd.read_csv(output_file)
        print("\nSuccessfully read the corrected CSV:")
        print(df.head())
    except pd.errors.ParserError as e:
        print(f"\nError reading the corrected CSV: {e}")
        print("Further manual correction might be needed.")
