"use client";

import { useState } from "react";
import Alert from "@/components/ui/Alert";
import { useCreateProject } from "@/hooks/useProjects";

interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess?: (projectId: string) => void;
}

export default function CreateProjectModal({
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");
  const [contributors, setContributors] = useState<string[]>([]);
  const [showContributorDropdown, setShowContributorDropdown] = useState(false);
  const [error, setError] = useState("");

  const { createProject, isLoading: isCreating } = useCreateProject();

  const handleAddContributor = () => {
    if (contributorEmail && !contributors.includes(contributorEmail)) {
      setContributors([...contributors, contributorEmail]);
      setContributorEmail("");
    }
    setShowContributorDropdown(false);
  };

  const handleRemoveContributor = (email: string) => {
    setContributors(contributors.filter((c) => c !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }

    try {
      const newProject = await createProject({
        name: title.trim(),
        description: description.trim() || undefined,
        contributors: contributors.length > 0 ? contributors : undefined,
      });

      if (newProject?.id && onSuccess) {
        onSuccess(newProject.id);
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Créer un projet</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError("")}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=""
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=""
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
            />
          </div>

          {/* Contributeurs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contributeurs
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowContributorDropdown(!showContributorDropdown)
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span className="text-gray-500">
                  {contributors.length > 0
                    ? `${contributors.length} collaborateur${contributors.length > 1 ? "s" : ""}`
                    : "Choisir un ou plusieurs collaborateurs"}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showContributorDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="email"
                      value={contributorEmail}
                      onChange={(e) => setContributorEmail(e.target.value)}
                      placeholder="Email du collaborateur"
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleAddContributor}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                    >
                      Ajouter
                    </button>
                  </div>

                  {contributors.length > 0 && (
                    <div className="space-y-1">
                      {contributors.map((email) => (
                        <div
                          key={email}
                          className="flex items-center justify-between px-2 py-1 bg-gray-50 rounded text-sm"
                        >
                          <span className="text-gray-700">{email}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveContributor(email)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bouton */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              {isCreating ? "Création..." : "Ajouter un projet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
