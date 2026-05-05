-- Switch the volume base unit from `ml` to `fl_oz` so within-category
-- conversions match the user-facing convention. `to_base_factor` for every
-- volume row is recalculated against `fl_oz`.

update public.unit_definitions
set base_unit      = 'fl_oz',
    to_base_factor = case unit
      when 'ml'    then 0.033814
      when 'L'     then 33.814
      when 'tsp'   then 0.166667
      when 'tbsp'  then 0.5
      when 'cup'   then 8
      when 'fl_oz' then 1
    end
where unit_category = 'volume';
