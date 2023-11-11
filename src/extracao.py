from PyPDF2 import PdfReader

with open("catalogo.pdf", "rb") as pdf_file:
    pdf_reader = PdfReader(pdf_file)
    num_pages = len(pdf_reader.pages)
    text = ""
    for page in range(num_pages):
        page_content = pdf_reader.pages[page].extract_text()
        text += (page_content)

    print(text)

from PyPDF2 import PdfReader

reader = PdfReader("catalogo.pdf")

page = reader.pages[0]
count = 0

for image_file_object in page.images:
    with open(str(count) + image_file_object.name, "wb") as fp:
        fp.write(image_file_object.data)
        count += 1