# B2B - Frontend

Proyecto frontend correspondiente al carrito de compras B2B.

## Inicio

#### Clonar the repo

```shell
git clone git@github.com:koandina/b2b-frontend.git
cd /b2b-frontend
```

#### Instalar npm packages

```shell
npm install
npm run start
```

#### npm scripts

Comandos útiles en `package.json`:

- `npm run start` - compila e inicia el proyecto localmente
- `npm run start-mobile` - compila e inicia el proyecto en un localhost accesible desde el celular por ip
- `npm run build` - compila el proyecto con el enviroment de dev
- `npm run build:qa` - compila el proyecto con el enviroment de qa
- `npm run build:prod` - compila el proyecto con el enviroment de prod
- `npm run compodoc` - genera toda la documentación estructural del proyecto

  ## .github\workflows

  Contienen los yml necesarios para implentar CI en cada ambiente.

  ## /documentation

  Carpeta generada mediante el comando `compodoc` mencionado anteriormente. Tiene todos los archivos necesarios. Éstos se encuentran subidos en la siguiente direccion: https://d2phmk2porqgq7.cloudfront.net/
  Usuario: front-documents
  Contraseña: User!B2B!Frontend!2020

  ## /mailing

  Contiene los templates originales de los mails que envia la aplicación. Estos no son los que utiliza la app directamente ya que se toman de una tabla Dynamo. Sin embargo, se mantienen los originales en este directorio para tenerlos documentados.

  ## Core Module

  ### State

  La app utiliza **NgRx** para el manejo de datos globales de la aplicación. Estos conforman lo que es el state. Toda la lógica del mismo esta definida en la carpeta src/app/core/state. Esta compuesto de 4 objetos definidos en el app.state.ts

* cart: Cart; // Carrito
* user: UserInfo; // Usuario
* userLocal: UserLocal; // Datos locales del usuario
* client: Client; // Datos del cliente

  Cada objeto tiene un **action** donde se definen las acciones que permiten modificarlo y también un **reducer** donde se define cómo será esa modificación. Para los siguientes ejemplos se utilizará el objeto Client.
  En el app.state.ts tambien se configura la sincronizacion del state con el localStorage. Esto permite mantener vivos los datos al cerrarse la pestaña. Luego, para eliminar datos se pueden usar acciones especificas segun se requiera. Por ejemplo la accion "logout" borra todo el state a expecion del objeto userLocal.

  #### Actions

  Por cada propiedad del state que se quiera modificar se debe crear un nuevo action y su correspondiente reducer.

```javascript
export const updateClient = createAction('[Client] updateClient', props<{ client: Client }>());
export const loadVisitDates = createAction('[Client] loadVisitDates', props<{ visitDates: VisitDate[] }>());
export const loadOrders = createAction('[Client] loadOrders', props<{ orders: Order[] }>());
```

#### Reducers

El reducer debe indicar el estado inicial para cada objeto y nunca debe modificar el state directamente. Para eso debe utilizar metodos inmutables, los cuales generan un nuevo objeto. Esto permitirá que cada componente suscripto al state reaccione ante cualquier cambio.

```javascript
const initialState: Client = {
  fantasyName: '',
  clientId: 0,
  erpClientId: '0',
  fiscalId: '0',
  rol: '',
  data: {
    visitDates: [],
  },
};
export const clientReducer =
  createReducer <
  Client >
  (initialState,
  on(ClientActions.updateClient, (state, props): Client => ({ ...state, ...props.client })),
  on(ClientActions.loadVisitDates, (state, props): Client => ({ ...state, data: { ...state.data, visitDates: props.visitDates } })),
  on(ClientActions.loadOrders, (state, props): Client => ({ ...state, data: { ...state.data, orders: props.orders } })));
```

#### Store

El Store es una clase del paquete @ngrx/store que nos permite acceder (select) y modificar (dispatch) el state desde cualquier compomente.

#### Selects

Permite suscribirse a la porción del state que necesitemos. Luego con el collback se puede guardar la información en una propiedad local o hacer lo que sea necesario.
Es muy importante agregar las dessuscripciones correspondientes en el destroy del componente.

```javascript
export class KaRightSidebarComponent implements OnInit, OnDestroy {
  user: UserInfo;
  selectedClient: Client;
  private subscriptions = new Subscription();
  constructor(private store: Store<{ user: UserInfo; client: Client }>) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.selectedClient = client)));
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
```

#### Dispatchers

Permiten ejecutar las acciones previamente definidas en los actions.

```javascript
this.store.dispatch(updateClient({ client: this.selectedClient }));
```

### Servicios

La gran mayoría de los servicios se utilizan de forma cross a los distintos módulos, de manera que se encuentran en el core de la apicación. A excepcion de los servicios de cognito, que utilizan Amplify, el resto utiliza una suerte de middleware antes de hacer el llamado http. Este middleware es api.service.ts. Permite definir distintos argumentos específicos para cada llamado: si requiere spinner, el tipo de spinner, si debe mostrar un toast error, si es público, etc.
Además tambien se utiliza un interceptor llamado aws.interceptor.ts que inserta el jwt en cada request, además de otros headers imporantes.

### Interfaces y Enums

Es deseable usar interfaces siempre que sea posible. Lo mismo aplica para los Enumerados, para evitar la mayor cantidad de strings hardcodeados en la app. Ambos se definen en el core de la app.

## Shared Module

Este módulo comprende todos los componentes que son compartidos por los distintos módulos y componentes de la aplicación. Tal ese el caso de widgets o modals.
También se utiliza para importar los módulos que también son requeridos por todos los módulos de la aplicación. Por ejemplo, módulos muy comunes como el RouterModule o el FormsModule.

## Login Module

Éste módulo contiene dos grandes viajes: el de login y el de registro. Ambos comprenden muchos pasos asi que para evitar crear una cantidad innumerable de componentes se decidio crear uno solo para cada caso: **sign-in** y **sign-up**. Y para manejar la lógica de los pasos se creó un servicio local llamado **login-steps.service**. Este servicio contiene un método especifico para cada componente que devuelve los pasos que debe manejar y que debe mostrar y hacer cada paso. El html y el typescript estan preparados para renderizar y ejecutar lo que corresponda respectivamente. Para el caso del registro la lógica es mucho mas linear y simple, para el caso del login es mucho más compleja asi que se debe modificar con especial cuidado.

## My Orders Module

Este módulo muestra un listado de los pedidos generados por el cliente seleccionado.

#### getClientOrders()

Lo que se puede destacar de este módulo es el procesamiento previo que hace de la respuesta del servicio getClientOrders(). El servicio responde un array de Orders. Las mismas se agrupan en el mismo service por orderId. Cuando hay más de una con el mismo orderId significa que incluye el pedido original del B2B y luego subpedidos generados por SAP. Entonces se busca cuál de todos esos pedidos cumple con "origin === 'B2B'". El que lo cumpla será el pedido original y los demas se agruparan como subpedidos en el campo sapOrders, que es generado por el front. Así se genera un nuevo array, acorde a las necesidades del front. Para los casos en que haya un solo orderId o que el mismo este en null, simplemente se agregan el nuevo array de forma unitaria.

#### KaMyHistoryComponent

Una vez terminado el preprocesamiento es el componente KaMyHistoryComponent el encargado de trabajar con esa data. Simplemente recorre el array de orders y genera una fila por cada una. Si alguna tiene sapOrders se agrupan utilizando ngb-accordion. Si no tiene se lista normalmente.
Por otro lado, si la orden cumple con "origin === 'B2B'" se agrega un botón "Ver detalle" que llamará el servicio getOrderDetail() para obtener el detalle de ese pedido.
Se puede mencionar tambien que los pedidos que no tienen orderId indican que fueron generados por un canal de venta distinto del B2B. En esos casos se mostrará cual fué el canal de venta (sourceChannel), los datos referidos el pedido y no se mostrará el boton "Ver detalle".

# Styles

Se recomienda agregar en el **styles.scss** general de la app todos los estilos que formen parte del UI Kit de la aplicación. Es decir que se utilizaran de forma cross e los distintos módulos y componentes. Se puede subdividir el archivo en caso de ser necesario.
Lo mismo aplica **variables.scss**. Incorporar ahí cualquier color, fuente, breakpoint o cualquier otra variable de estilo de la app.

# Icons

Si bien aún existen algunos archivos .svg o .png para íconos, la gran mayoría se obtienen de tabler-sprite.svg.
Este archivo contiene todos los íconos de https://tablericons.com/.
Se importan en cada componente de la siguiente forma:

```html
<svg><use xlink:href="./assets/icons/tabler-sprite.svg#tabler-lock" /></svg>
```

Siendo tabler-lock el id del svg requerido dentro de tabler-sprite.svg.
