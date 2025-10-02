/**
 * @file Metadata suggestions supported extensions
 * @author Box
 */

const SUPPORTED_FILE_EXTENSIONS = new Set([
// Text-Based Documents
'as', 'as3', 'asm', 'bat', 'c', 'cc', 'cmake', 'cpp', 'cs', 'css', 'csv', 'cxx', 'diff', 'doc', 'docx', 'erb', 'gdoc', 'groovy', 'gsheet', 'h', 'haml', 'hh', 'htm', 'html', 'java', 'js', 'json', 'less', 'log', 'm', 'make', 'md', 'ml', 'mm', 'msg', 'ods', 'odt', 'pdf', 'php', 'pl', 'properties', 'py', 'rb', 'rst', 'rtf', 'sass', 'scala', 'scm', 'script', 'sh', 'sml', 'sql', 'txt', 'vi', 'vim', 'webdoc', 'wpd', 'xhtml', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xml', 'xsd', 'xsl', 'xbd', 'xdw', 'yaml',
// iWorks Files,
'key', 'pages', 'numbers',
// Presentations
'gslide', 'gslides', 'odp', 'ppt', 'pptx',
// Box Formats
'boxcanvas', 'boxnote',
// Images
'ai', 'bmp', 'cr2', 'crw', 'dcm', 'dicm', 'dicom', 'dng', 'dwg', 'eps', 'gif', 'heic', 'jpeg', 'jpg', 'nef', 'png', 'ps', 'psd', 'raf', 'svg', 'tga', 'tif', 'tiff', 'webp']);
export function isExtensionSupportedForMetadataSuggestions(extension) {
  return SUPPORTED_FILE_EXTENSIONS.has(extension);
}
//# sourceMappingURL=isExtensionSupportedForMetadataSuggestions.js.map