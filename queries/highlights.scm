; Keywords
[
  "import"
  "as"
  "struct"
  "enum"
  "interface"
] @keyword

; Built-in primitives
(primitive_type) @type.builtin

; Generic type names (Option, Result, Vec, Set, Map, Ref, Buf)
(option_type "Option" @type.builtin)
(result_type "Result" @type.builtin)
(vec_type "Vec" @type.builtin)
(set_type "Set" @type.builtin)
(map_type "Map" @type.builtin)
(ref_type "Ref" @type.builtin)
(buf_type "Buf" @type.builtin)

; Type definitions
(struct_definition name: (type_identifier) @type.definition)
(enum_definition name: (type_identifier) @type.definition)
(interface_definition name: (type_identifier) @type.definition)

; Type references
(named_type (type_identifier) @type)
(qualified_type namespace: (identifier) @module)
(qualified_type name: (identifier) @type)
(enum_variant name: (type_identifier) @type)

; Fields
(field name: (identifier) @property)

; Parameters
(parameter name: (identifier) @variable.parameter)

; Methods
(method name: (identifier) @function.method)

; Return arrow
(return_type "->" @punctuation.delimiter)

; Imports
(import_name) @string
(import_declaration namespace: (identifier) @module)

; Integers
(integer) @number

; Comments
(doc_comment) @comment.documentation
(line_comment) @comment

; Punctuation
["{" "}" "(" ")" "[" "]" "<" ">"] @punctuation.bracket
["," ":" ";" "::"] @punctuation.delimiter
