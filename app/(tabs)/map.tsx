import { Card, ProgressPill } from "../../components/ui";
import { ShellScreen } from "../../components/shell";

export default function MapScreen() {
  return (
    <ShellScreen
      eyebrow="Map"
      title="Water worth remembering."
      description="A quiet map shell for future place memory, habitats, and trips."
    >
      <Card elevated>
        <ProgressPill label="Mapped waters" current={0} total={12} />
      </Card>
    </ShellScreen>
  );
}
