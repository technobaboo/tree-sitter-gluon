(source_file) @local.scope
(import_declaration "as" (identifier) @local.definition)
(struct_definition name: (type_identifier) @local.definition)
(enum_definition name: (type_identifier) @local.definition)
(interface_definition name: (type_identifier) @local.definition)
(named_type (type_identifier) @local.reference)
(qualified_type namespace: (identifier) @local.reference)
