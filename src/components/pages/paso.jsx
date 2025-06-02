import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Paso1 from "@/components/pages/paso1";
import Paso2 from "@/components/pages/paso2";
import Paso3 from "@/components/pages/paso3";
import Paso5 from "@/components/pages/paso5";
import Paso7 from "@/components/pages/paso7";
import Paso8 from "@/components/pages/paso8";
import Paso9 from "@/components/pages/paso9";
import Paso10 from "@/components/pages/paso10";
import Paso11 from "@/components/pages/paso11";
import Paso12 from "@/components/pages/paso12";

export default function Paso() {
  const { numero } = useParams();
  const paso = parseInt(numero, 10);

  const renderContenidoPaso = () => {
    switch (paso) {
      case 1:
        return <Paso1 />;
      case 2:
        return <Paso2 />;
      case 3:
        return <Paso3 />;
      case 5:
        return <Paso5 />; // ← Añade este case
      case 7:
        return <Paso7 />;
      case 8:
        return <Paso8 />;
      case 9:
        return <Paso9 />;
      case 10:
        return <Paso10 />;
      case 11:
        return <Paso11 />;
      case 12:
        return <Paso12 />;
      default:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Paso {paso}</h2>
            <p>No hay formulario definido para este paso aún.</p>
          </>
        );
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          {renderContenidoPaso()}
        </CardContent>
      </Card>
    </div>
  );
}
