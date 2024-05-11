import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "./ui/button";
import Image from "next/image";

export function About() {
  return (
    <div className="pb-3 pt-2">
      <Button variant="secondary" className="w-full ">
        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            Acerca de ...
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="col-12 flex pb-4">
                <div className="col-6">
                  <Image
                    src="/dcm.png"
                    width={250}
                    height={250}
                    alt={"dcm.png"}
                  />
                </div>
                <div className="col-6">
                  <AlertDialogTitle className="pb-4">
                    Versión 4.2.2
                  </AlertDialogTitle>
                  <AlertDialogTitle>Fecha: 11 de mayo de 2024</AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription>
                <p>Licencia: Evaluación</p>
              </AlertDialogDescription>

              <AlertDialogDescription>
                <p>Copyright © 2024 Lockers Inteligentes DCM Solution S.A.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Button>
    </div>
  );
}
