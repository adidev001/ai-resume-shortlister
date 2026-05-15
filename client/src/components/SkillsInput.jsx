import { useState } from 'react';
import { Plus } from 'lucide-react';
import SkillTag from './SkillTag';

/**
 * Tag-style input for adding multiple skills.
 * @param {Array} skills - Current skills array
 * @param {function} onChange - Callback when skills change
 * @param {string} placeholder - Input placeholder
 */
export default function SkillsInput({
  skills = [],
  onChange,
  placeholder = 'Type a skill and press Enter...',
}) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
    // Remove last skill on Backspace if input is empty
    if (e.key === 'Backspace' && !input && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-field flex-1"
        />
        <button
          type="button"
          onClick={addSkill}
          disabled={!input.trim()}
          className="btn-secondary flex items-center gap-2 px-4"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {skills.map((skill) => (
            <SkillTag key={skill} skill={skill} onRemove={removeSkill} />
          ))}
        </div>
      )}
    </div>
  );
}
