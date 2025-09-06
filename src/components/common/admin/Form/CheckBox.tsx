"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type CheckBoxProps = {
    name : string;
    label?: string;
    placeholder?: string;
    className?: string;
    value?: string;
}


export function CheckboxInput(props: CheckBoxProps) {
    const {name,label,placeholder,className ,value} = props;

  return (
    <div className="flex flex-col gap-6 mb-3">
      <div className="flex items-center gap-3">
        <Checkbox id={name} name={name} value={value}/>
        <Label htmlFor={name}>{label}</Label>
      </div>
    </div>
  )
}
