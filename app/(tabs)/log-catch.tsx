import { ShellScreen } from "../../components/shell";
import { EmptyState } from "../../components/ui";

export default function LogCatchScreen() {
  return (
    <ShellScreen
      eyebrow="Log Catch"
      title="Capture the moment."
      description="The future catch flow starts here, but no journal data is written yet."
    >
      <EmptyState
        title="Catch logging is staged"
        message="Auth, storage, and draft sync will arrive before real entries are saved."
      />
    </ShellScreen>
  );
}
