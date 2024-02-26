// export default function Card(props: {}) {
//   return (
//     <Card className="grid w-[45vh] overflow-hidden shadow-xl" key={size.id}>
//       <CardHeader>
//         <CardTitle> {size.nombre}</CardTitle>
//         <CardDescription>Seleccione el tamaño de su locker.</CardDescription>
//       </CardHeader>
//       <img className="aspect-video object-cover" src="/placeholder.svg"></img>
//       <CardFooter className="bg-green-100 backdrop-blur-sm">
//         <div className="flex pt-5">
//           <div className="">Número de taquillas</div>
//           <div className="float-end inline-flex">
//             <button
//               onClick={() => setValue(value - 1)}
//               className="w-10 rounded-l bg-orange-500 font-bold text-gray-800 hover:bg-gray-400"
//             >
//               -
//             </button>
//             <Input
//               className="flex w-10 rounded-l rounded-r bg-gray-300 text-black"
//               disabled={true}
//               value={`${size.cantidadSeleccionada}`}
//             ></Input>
//             <button
//               disabled={value == size.cantidad}
//               onClick={() =>
//                 props.setSize({
//                   ...size,
//                   cantidadSeleccionada: 1,
//                 })
//               }
//               className="w-10 rounded-r bg-orange-500  font-bold text-gray-800 hover:bg-gray-400"
//             >
//               +
//             </button>
//           </div>
//           {/* <Button className="bg-orange-500	">+</Button> */}
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
