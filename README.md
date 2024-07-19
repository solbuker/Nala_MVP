
# Nala Demo

Esta es una aplicación con Rails API y una interfaz React frontend.

Rails 7.1, Ruby 3.2, React 18

Se utiliza para crear un portal de vacaciones donde la empresa puede visualizar y manejar las vacaciones de cada empleado.
- Se puede ingresar como un líder, donde se pueden ver las vacaciones de los empleados a cargo y las vacaciones propias, asi como también aprobar o rechazar vacaciones o solicitar vacaciones propias.
- Los datos se cargan a través de una Rake Task que lee el archivo y carga los datos a la base de datos. Este archivo puede ser reemplazo de ser necesario y los datos ya existentes no se volverán a cargar.
- La autenticación se maneja con la gema Devise mediante el usuario User. Para mayor seguridad, solo pueden crear un usuario los individuos con email @nalademo.com
- La paginación se maneja con la gema Pagy que devuelve la cantidad de elementos que se pidan en cada request (10 como default)
- Los filtros se manejan con la gema Ransack. Actualmente la interfaz permite filtrar por empleado y líder.
- La cantidad de días de vacaciones se devuelven mediante un método en el modelo employee llamado _total_vacation_days_ que devuelve la cantidad de días que tomo cada empleado de vacaciones teniendo en cuenta solo las peticiones aprobadas.
- La base de datos es PostgreSQL y se utilizan índices únicos para `email` en la tabla `users`.
- Adicionalmente, hay validaciones en los modelos para evitar que campos requeridos esten vacios u otros errores.
- Los tests se realizan utilizando Minitest y Shoulda-matchers.
- Para asegurar buenas prácticas de código y un formato limpio, se utiliza Rubocop.
- En los controladores _employees_controller_ y _vacations_controller_ se encuentran los métodos para realizar las operaciones CRUD, que devuelven informacion en formato JSON.
- En la interfaz frontend se utilizan componentes MUI para las distintas páginas.
- En la página principal se observan las vacaciones por empleado, la paginación y los filtros. Adicionalmente hay otras páginas para editar, eliminar o crear empleados o vacaciones.

## Pasos para la utilización:
```
git clone https://github.com/solbuker/Nala_demo.git
```
```
cd api
bundle install
rails db:create
rails db:migrate
FILE=vacaciones.xlsx bundle exec rake import:vacation_data
rails s
```
```
cd ..
cd frontend
npm install
npm start
```
