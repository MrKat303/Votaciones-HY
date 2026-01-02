-- 7. SEGURIDAD COMPLETA PARA LOGIN
-- Esta función verifica las credenciales de forma segura en el servidor de base de datos
-- y evita que se expongan las contraseñas al cliente.

create or replace function login_admin(_rut text, _password text)
returns json
language plpgsql
security definer -- Se ejecuta con permisos de administrador (bypasea RLS)
as $$
declare
  found_admin record;
begin
  select id, rut 
  into found_admin
  from admins
  where rut = _rut and password = _password;

  if found_admin.id is not null then
    return json_build_object('success', true, 'id', found_admin.id, 'rut', found_admin.rut);
  else
    return json_build_object('success', false);
  end if;
end;
$$;

-- 8. PROTEGER LA TABLA ADMINS
-- Revocar acceso público a la tabla admins para que nadie pueda leerla desde el navegador
alter table admins enable row level security;

-- Crear una política que bloquee todo acceso directo (solo accesible via la función RPC o Service Role)
create policy "No direct access to admins" on admins
  for all
  using (false);

-- Permitir que la función RPC sea ejecutada por usuarios anónimos
grant execute on function login_admin(text, text) to anon;
grant execute on function login_admin(text, text) to authenticated;
