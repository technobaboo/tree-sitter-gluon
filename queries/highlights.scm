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

; Generic type names (Vec, Set, Map, Ref)
(vec_type "Vec" @type.builtin)
(set_type "Set" @type.builtin)
(map_type "Map" @type.builtin)
(ref_type "Ref" @type.builtin)

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

; Import paths
(import_path) @string

; Integers
(integer) @number

; Comments
(doc_comment) @comment.documentation
(line_comment) @comment

; Punctuation
["{" "}" "(" ")" "[" "]" "<" ">"] @punctuation.bracket
["," ":" ";" "::"] @punctuation.delimiter

; Import alias identifier
(import_declaration "as" (identifier) @module)
