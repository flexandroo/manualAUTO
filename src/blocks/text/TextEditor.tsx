import type { TextBlockData, TextStyle } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { TextStyleControls } from '../../components/ui/TextStyleControls';
import { makeStyleUpdater } from '../../utils/blockStyles';
import { TEXT_DEFAULTS } from './textStyles';

interface Props {
  data: TextBlockData;
  onChange: (data: TextBlockData) => void;
}

export function TextEditor({ data, onChange }: Props) {
  const styles = data.styles ?? {};
  const updateStyle = makeStyleUpdater(data, onChange);
  const styleFor = (key: string) => (
    <TextStyleControls
      value={styles[key]}
      onChange={(s: TextStyle) => updateStyle(key, s)}
      defaultSize={TEXT_DEFAULTS[key].fontSize}
      defaultBold={TEXT_DEFAULTS[key].bold}
    />
  );

  return (
    <div>
      <FieldGroup label="Заголовок" hint='Наприклад "Призначення", "Опис", "Вступ"'>
        <Input
          value={data.heading}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
        />
        {styleFor('heading')}
      </FieldGroup>
      <FieldGroup label="Текст">
        <Textarea
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          rows={12}
        />
        {styleFor('body')}
      </FieldGroup>
    </div>
  );
}
