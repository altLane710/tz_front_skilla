import { Avatar } from "radix-ui";
import "./styles.css";

const UiAvatar = ({ src }: { src: string }) => (
  <div style={{ display: "flex", gap: 20 }}>
    <Avatar.Root className="AvatarRoot">
      <Avatar.Image className="AvatarImage" src={src} alt="" />
      <Avatar.Fallback className="AvatarFallback" delayMs={600}>
        CT
      </Avatar.Fallback>
    </Avatar.Root>
  </div>
);

export default UiAvatar;
