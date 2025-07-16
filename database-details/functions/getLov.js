module.exports.getLovFunction = `CREATE OR REPLACE FUNCTION lov.inv_get_lov(
    params text
)
RETURNS jsonb
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    _source TEXT;
    _hierarchy TEXT := 'tbl_mst_';
    _column_name TEXT;
    _column_label TEXT;
    _where_column TEXT;
    _where_value TEXT;
    _where_value_type TEXT;
    input_json JSONB;
    result_json JSONB := '[]'::jsonb;
    dynamic_query TEXT;
    query_result RECORD;
    where_clause TEXT := '';
BEGIN
    -- Parse the input JSON
    input_json := params::JSONB;
    
    -- Extract values from the input JSON
    _source := input_json ->> 'source';
    _hierarchy := _hierarchy || LOWER(input_json ->> 'hierarchy');
    _column_name := input_json ->> 'columnName';
    _column_label := input_json ->> 'columnValue';
    _where_column := input_json ->> 'whereColumn';
    _where_value := input_json ->> 'whereValue';
    _where_value_type := input_json ->> 'whereValueType';

    -- Build the WHERE clause
    IF _where_column IS NOT NULL THEN
        IF _where_value_type = 'INTEGER' THEN
            where_clause := format('WHERE %I = %s', _where_column, _where_value::INTEGER);
        ELSIF _where_value_type = 'TEXT' THEN
            IF _where_value IS NULL THEN
                where_clause := format('WHERE %I IS NULL', _where_column);
            ELSE
                where_clause := format('WHERE %I = %L', _where_column, _where_value);
            END IF;
        ELSIF _where_value_type = 'BOOLEAN' THEN
            where_clause := format('WHERE %I = %s', _where_column, (_where_value::BOOLEAN)::TEXT);
        ELSE
            RAISE EXCEPTION 'Unrecognized or NULL whereValueType';
        END IF;
    END IF;

    -- Build the dynamic SQL query
    dynamic_query := format(
        'SELECT %I AS label, %I AS value FROM %I.%I %s',
        _column_label,
        _column_name,
        _source,
        _hierarchy,
        where_clause
    );

    RAISE NOTICE 'Query generated : %', dynamic_query;

    -- Execute and build JSON result
    FOR query_result IN EXECUTE dynamic_query LOOP
        result_json := result_json || jsonb_build_array(
            jsonb_build_object(
                'label', query_result.label,
                'value', query_result.value
            )
        );
    END LOOP;

    RETURN result_json;
END;
$BODY$;`;