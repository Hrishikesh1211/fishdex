import { Card, AppText, LoadingState } from "../../components/ui";
import { ShellScreen } from "../../components/shell";

export default function SignalsScreen() {
  return (
    <ShellScreen
      eyebrow="Signals"
      title="Conditions without the noise."
      description="A future surface for patterns, seasons, and gentle trip intelligence."
    >
      <Card>
        <AppText variant="body" tone="secondary">
          Signals will stay calm, privacy-safe, and grounded in the field journal.
        </AppText>
      </Card>
      <LoadingState label="Signal system placeholder" />
    </ShellScreen>
  );
}
