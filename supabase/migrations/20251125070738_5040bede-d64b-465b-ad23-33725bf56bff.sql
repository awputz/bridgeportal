-- Assign admin role to office@bridgenyre.com user
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'office@bridgenyre.com'
ON CONFLICT (user_id, role) DO NOTHING;