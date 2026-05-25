import { Card, AppText } from "../../components/ui";
import { ShellScreen } from "../../components/shell";

export default function SignalsScreen() {
  return (
    <ShellScreen
      eyebrow="Nearby"
      title="Nearby."
      description="Simple hints for what is moving."
    >
      <Card>
        <AppText variant="body" tone="secondary">
          Nothing nearby yet.
        </AppText>
      </Card>
    </ShellScreen>
  );
}
