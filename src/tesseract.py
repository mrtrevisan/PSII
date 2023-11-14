import fitz  # PyMuPDF
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = "C:\Program Files\Tesseract-OCR\Tesseract.exe"

# Open the PDF file
pdf_document = fitz.open('catalogo.pdf')  # Replace 'seu_arquivo.pdf' with your PDF file

# Iterate through each page of the PDF
for page_num in range(14,17):
    page = pdf_document.load_page(page_num)
    image_list = page.get_pixmap()

    # Convert the image to PIL format
    pil_image = Image.frombytes("RGB", (image_list.width, image_list.height), image_list.samples)

    # Perform OCR on the image
    #custom_config = r'--oem 0 --psm 6'  config=custom_config
    resultado = pytesseract.image_to_string(pil_image)
    print(f"Page {page_num + 1}:\n{resultado}")

# Close the PDF document
pdf_document.close()
