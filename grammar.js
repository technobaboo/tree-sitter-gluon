/// <reference types="tree-sitter-cli/dsl" />

module.exports = grammar({
  name: "gluon",

  extras: ($) => [/\s/, $.line_comment],

  rules: {
    source_file: ($) =>
      seq(repeat($.import_declaration), repeat($._definition)),

    _definition: ($) =>
      choice($.struct_definition, $.enum_definition, $.interface_definition),

    // --- Imports ---

    import_declaration: ($) =>
      seq("import", $.import_path, optional(seq("as", $.identifier))),

    import_path: (_) => token(seq('"', /[^"]+/, '"')),

    // --- Definitions (require doc comments) ---

    struct_definition: ($) =>
      seq(
        repeat1($.doc_comment),
        "struct",
        field("name", $.type_identifier),
        "{",
        optional($.field_list),
        "}",
      ),

    enum_definition: ($) =>
      seq(
        repeat1($.doc_comment),
        "enum",
        field("name", $.type_identifier),
        "{",
        optional($.enum_variant_list),
        "}",
      ),

    interface_definition: ($) =>
      seq(
        repeat1($.doc_comment),
        "interface",
        field("name", $.type_identifier),
        "{",
        repeat($.method),
        "}",
      ),

    // --- Fields ---

    field_list: ($) => commaSep1($.field, optional(",")),

    field: ($) =>
      seq(
        repeat($.doc_comment),
        field("name", $.identifier),
        ":",
        field("type", $._type),
      ),

    // --- Enum variants ---

    enum_variant_list: ($) => commaSep1($.enum_variant, optional(",")),

    enum_variant: ($) =>
      seq(
        repeat($.doc_comment),
        field("name", $.type_identifier),
        optional(seq("{", optional($.field_list), "}")),
      ),

    // --- Methods ---

    method: ($) =>
      seq(
        field("name", $.identifier),
        "(",
        optional($.parameter_list),
        ")",
        optional($.return_type),
      ),

    parameter_list: ($) => commaSep1($.parameter),

    parameter: ($) =>
      seq(field("name", $.identifier), ":", field("type", $._type)),

    return_type: ($) =>
      seq("->", "(", optional($.parameter_list), ")"),

    // --- Types ---

    _type: ($) =>
      choice(
        $.primitive_type,
        $.vec_type,
        $.set_type,
        $.map_type,
        $.array_type,
        $.ref_type,
        $.qualified_type,
        $.named_type,
      ),

    primitive_type: (_) =>
      choice(
        "bool",
        "u8",
        "u16",
        "u32",
        "u64",
        "i8",
        "i16",
        "i32",
        "i64",
        "f32",
        "f64",
        "String",
        "Fd",
      ),

    vec_type: ($) => seq("Vec", "<", field("element", $._type), ">"),

    set_type: ($) => seq("Set", "<", field("element", $._type), ">"),

    map_type: ($) =>
      seq("Map", "<", field("key", $._type), ",", field("value", $._type), ">"),

    array_type: ($) =>
      seq("[", field("element", $._type), ";", field("size", $.integer), "]"),

    ref_type: ($) =>
      prec(1, seq("Ref", optional(seq("<", $._ref_inner, ">")))),

    _ref_inner: ($) =>
      choice(
        seq($.identifier, "::", $.identifier),
        $.identifier,
      ),

    qualified_type: ($) =>
      seq(
        field("namespace", $.identifier),
        "::",
        field("name", $.identifier),
      ),

    named_type: ($) => $.type_identifier,

    // --- Tokens ---

    type_identifier: (_) => /[A-Za-z_][A-Za-z0-9_]*/,

    identifier: (_) => /[A-Za-z_][A-Za-z0-9_]*/,

    integer: (_) => /[0-9]+/,

    // --- Comments ---

    doc_comment: (_) => token(seq("///", /[^\n]*/)),

    line_comment: (_) =>
      token(seq("//", optional(seq(/[^\/\n]/, /[^\n]*/)))),
  },
});

/**
 * Comma-separated list of one or more items, with optional trailing content.
 */
function commaSep1(rule, trailing) {
  const base = seq(rule, repeat(seq(",", rule)));
  return trailing ? seq(base, trailing) : base;
}
