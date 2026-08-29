// // import { useGLTF } from "@react-three/drei";
// // import { useFrame } from "@react-three/fiber";
// // import { useRef } from "react";

// // export default function Model({ modelPath }) {
// //   console.log(modelPath,"modelPath");
// //   if (!modelPath) return null;
// //   const { scene } = useGLTF(modelPath);

// //   const ref = useRef();

// //   useFrame(() => {
// //     if (ref.current) {
// //       ref.current.rotation.y += 0.01;
// //     }
// //   });

// //   return (
// //     <primitive
// //       ref={ref}
// //       object={scene}
// //       scale={1}
// //     />
// //   );
// // }


// import { useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import { useGLTF } from "@react-three/drei";

// export default function Model({ modelPath, position = [0, 0, 0] }) {
//   const modelRef = useRef();

//   const { scene } = useGLTF(modelPath);

//   useFrame((state) => {
//     const t = state.clock.getElapsedTime();

//     if (modelRef.current) {
//       // حركة عوم
//      modelRef.current.position.y =
//   position[1] + Math.sin(t * 2) * 2;
//       // دوران بسيط
//     modelRef.current.rotation.y = t;
//     }
//   });

//   return (
//     <group ref={modelRef} position={position}>
//       <primitive object={scene} scale={3} />
//     </group>
//   );
// }