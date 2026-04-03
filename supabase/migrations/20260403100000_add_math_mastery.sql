-- Add math mastery column to pasa_learners
ALTER TABLE pasa_learners ADD COLUMN IF NOT EXISTS math_mastery jsonb DEFAULT '{}'::jsonb;

-- RPC: save math progress — requires avatar+name+pin
CREATE OR REPLACE FUNCTION learner_save_math(p_name text, p_pin text, p_avatar text, p_math_mastery jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  lid uuid;
BEGIN
  SELECT id INTO lid FROM pasa_learners
  WHERE avatar = p_avatar AND name = trim(p_name) AND pin = p_pin;

  IF lid IS NULL THEN
    RETURN jsonb_build_object('error', 'Invalid credentials.');
  END IF;

  UPDATE pasa_learners SET
    math_mastery = p_math_mastery,
    last_seen = now()
  WHERE id = lid;

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- Update login to also return math_mastery
CREATE OR REPLACE FUNCTION learner_login(p_name text, p_pin text, p_avatar text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result jsonb;
  fail_count int;
  attempt_key text := p_avatar || ':' || trim(p_name);
BEGIN
  SELECT count(*) INTO fail_count
  FROM pasa_login_attempts
  WHERE attempted_name = attempt_key
    AND attempted_at > now() - interval '5 minutes';

  IF fail_count >= 3 THEN
    RETURN jsonb_build_object('error', 'Too many attempts. Please wait 5 minutes and try again.');
  END IF;

  SELECT jsonb_build_object(
    'id', id, 'name', name, 'pin', pin, 'avatar', avatar,
    'reading_mastered', reading_mastered, 'proficiency', proficiency,
    'math_mastery', math_mastery,
    'created_at', created_at, 'last_seen', last_seen
  ) INTO result
  FROM pasa_learners
  WHERE avatar = p_avatar AND name = trim(p_name) AND pin = p_pin;

  IF result IS NULL THEN
    INSERT INTO pasa_login_attempts (attempted_name) VALUES (attempt_key);
    RETURN jsonb_build_object('error', 'No account found. Check your animal, name and PIN.');
  END IF;

  DELETE FROM pasa_login_attempts WHERE attempted_name = attempt_key;
  UPDATE pasa_learners SET last_seen = now()
  WHERE avatar = p_avatar AND name = trim(p_name) AND pin = p_pin;

  RETURN result;
END;
$$;
