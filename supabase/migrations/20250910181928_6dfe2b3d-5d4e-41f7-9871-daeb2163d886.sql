-- Add admin role for existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('f6ed1821-6bb1-492d-bf53-068a01254179', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;