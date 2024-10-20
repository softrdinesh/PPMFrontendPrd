const defaultFonts = ['Arial', 'Comic Sans MS', 'Courier New', 'Impact', 'Georgia', 'Tahoma', 'Trebuchet MS', 'Verdana']

const sortedFontOptions = [
  'Logical',
  'Salesforce Sans',
  'Garamond',
  'Sans-Serif',
  'Serif',
  'Times New Roman',
  'Helvetica',
  ...defaultFonts
].sort()

export const editorOptions = {
  buttonList: [
    ['undo', 'redo'],
    ['font', 'fontSize'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['fontColor', 'hiliteColor'],
    ['align', 'list', 'lineHeight'],
    ['outdent', 'indent'],

    ['table', 'horizontalRule'],

    // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
    // ['imageGallery'], // You must add the "imageGalleryUrl".
    // ["fullScreen", "showBlocks", "codeView"],
    ['preview', 'print'],
    ['removeFormat']

    // ['save', 'template'],
    // '/', Line break
  ], // Or Array of button list, eg. [['font', 'align'], ['image']]
  defaultTag: 'div',
  minHeight: '300px',
  showPathLabel: false,
  font: sortedFontOptions
}
