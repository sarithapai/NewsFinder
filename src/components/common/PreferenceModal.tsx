"use client";

import { savePreferencesToCookie } from "@/utils/savePreferencesToCookie";
import { useEffect, useState } from "react";

type PreferenceModalProps = {
  onClose: () => void;
};

const sources = ["NewsAPI", "The Guardian", "NYTimes"];

const PreferenceModal = ({ onClose }: PreferenceModalProps) => {
  const [selectedSources, setSelectedSources] = useState<string[]>([
    ...sources,
  ]);

  useEffect(() => {
    const getPreferencesFromCookie = () => {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith("newsPreferences="));
      if (!match) return;

      try {
        const cookieValue = decodeURIComponent(match.split("=")[1]);
        const preferences = JSON.parse(cookieValue);
        setSelectedSources(preferences.sources || []);
      } catch (err) {
        console.error("Error parsing preferences from cookie", err);
      }
    };
    getPreferencesFromCookie();
  }, []);

  const handleToggle = (
    value: string,
    list: string[],
    setList: (val: string[]) => void
  ) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleSave = () => {
    const preferences = {
      sources: selectedSources,
    };
    savePreferencesToCookie(preferences);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Customize Your Feed</h2>

        <div className="mb-4">
          <h3 className="font-medium">Sources</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {sources.map((source) => (
              <label key={source} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSources.includes(source)}
                  onChange={() =>
                    handleToggle(source, selectedSources, setSelectedSources)
                  }
                />
                {source}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceModal;
