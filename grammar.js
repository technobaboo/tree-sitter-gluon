module.exports = grammar({
	name: "gluon",

	extras: ($) => [/\s/, $.line_comment],

	word: ($) => $.identifier,

	rules: {
		source_file: ($) =>
			seq(
				repeat($.import_declaration),
				repeat(
					choice(
						$.interface_definition,
						$.struct_definition,
						$.enum_definition,
					),
				),
			),

		// Comments — line_comment excludes /// so doc_comment wins when expected
		line_comment: ($) => token(prec(-1, seq("//", /[^\n]*/))),

		doc_comment: ($) => token(prec(1, seq("///", /[^\n]*/))),

		// Import declarations
		import_declaration: ($) =>
			seq("import", $.import_path, optional(seq("as", $.identifier))),

		import_path: ($) => token(seq('"', /([^"\\]|\\.)*/, '"')),

		// Interface definition
		interface_definition: ($) =>
			seq(
				repeat($.doc_comment),
				"interface",
				field("name", alias($.identifier, $.type_identifier)),
				"{",
				repeat($.method),
				"}",
			),

		method: ($) =>
			seq(
				field("name", $.identifier),
				choice($.parameter_list, seq("(", ")")),
				optional($.return_type),
			),

		parameter_list: ($) =>
			seq(
				"(",
				$.parameter,
				repeat(seq(",", $.parameter)),
				")",
			),

		parameter: ($) =>
			seq(field("name", $.identifier), ":", field("type", $._type)),

		return_type: ($) => seq("->", choice($.parameter_list, seq("(", ")"))),

		// Struct definition
		struct_definition: ($) =>
			seq(
				repeat($.doc_comment),
				"struct",
				field("name", alias($.identifier, $.type_identifier)),
				$.field_list,
			),

		field_list: ($) =>
			seq(
				"{",
				optional(
					seq($.field, repeat(seq(",", $.field)), optional(",")),
				),
				"}",
			),

		field: ($) =>
			seq(
				repeat($.doc_comment),
				field("name", $.identifier),
				":",
				field("type", $._type),
			),

		// Enum definition
		enum_definition: ($) =>
			seq(
				repeat($.doc_comment),
				"enum",
				field("name", alias($.identifier, $.type_identifier)),
				$.enum_variant_list,
			),

		enum_variant_list: ($) =>
			seq(
				"{",
				optional(
					seq(
						$.enum_variant,
						repeat(seq(",", $.enum_variant)),
						optional(","),
					),
				),
				"}",
			),

		enum_variant: ($) =>
			seq(
				repeat($.doc_comment),
				field("name", alias($.identifier, $.type_identifier)),
				optional($.field_list),
			),

		// Types (hidden rule — concrete type appears directly in tree)
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

		primitive_type: ($) =>
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
			seq(
				"Map",
				"<",
				field("key", $._type),
				",",
				field("value", $._type),
				">",
			),

		array_type: ($) =>
			seq(
				"[",
				field("element", $._type),
				";",
				field("size", $.integer),
				"]",
			),

		ref_type: ($) =>
			seq(
				"Ref",
				optional(
					seq(
						"<",
						$.identifier,
						optional(seq("::", $.identifier)),
						">",
					),
				),
			),

		qualified_type: ($) =>
			prec(
				2,
				seq(
					field("namespace", $.identifier),
					"::",
					field("name", $.identifier),
				),
			),

		named_type: ($) => alias($.identifier, $.type_identifier),

		// Identifiers and literals
		identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

		integer: ($) => /[0-9]+/,
	},
});
