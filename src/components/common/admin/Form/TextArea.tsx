import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type TextareaProps = {
    name : string;
    label?: string;
    placeholder?: string;
    className?: string;
}

export function TextareaInput(props: TextareaProps) {
    const {name, label, placeholder, className} = props;

  return (
    <div className="grid w-full gap-3 mb-3">
      <Label htmlFor={name}>{label}</Label>
      <Textarea placeholder={placeholder} id={name} name={name} />
    </div>
  )
}
