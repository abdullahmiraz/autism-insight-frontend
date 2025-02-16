import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressChart from "./ProgressChart";
import DetectionForm from "./detection/DetectionForm";
import TherapyList from "./TherapyList";

export default function TabNavigation() {
  return (
    <Tabs defaultValue="detect" className="w-full">
      <TabsList className="flex justify-center gap-4">
        <TabsTrigger value="detect">Detect Symptoms</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
        <TabsTrigger value="therapy">Therapy Centers</TabsTrigger>
      </TabsList>

      <TabsContent value="detect">
        <DetectionForm />
      </TabsContent>

      <TabsContent value="progress">
        <ProgressChart />
      </TabsContent>

      <TabsContent value="therapy">
        <TherapyList />
      </TabsContent>
    </Tabs>
  );
}
