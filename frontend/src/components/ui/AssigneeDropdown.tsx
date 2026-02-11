'use client';

import { useState, useEffect, useId } from 'react';
import Image from 'next/image';
import { useSearchUsers } from '@/hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';
import { User } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface AssigneeDropdownProps {
    /** Liste des assignés sélectionnés */
    selectedAssignees: User[];
    /** Callback appelé quand la sélection change */
    onAssigneesChange: (assignees: User[]) => void;
    /** Label du champ (optionnel) */
    label?: string;
}

// ============================================================================
// Composant
// ============================================================================

/**
 * Dropdown de sélection d'assignés avec recherche
 * Permet de rechercher des utilisateurs et de les ajouter/retirer de la sélection
 */
export function AssigneeDropdown({
    selectedAssignees,
    onAssigneesChange,
    label = 'Assigné à :',
}: AssigneeDropdownProps) {
    const id = useId();
    const labelId = `${id}-label`;

    // État du dropdown
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Hook de recherche + debounce
    const { searchUsers, users: rawResults, isLoading: isSearching } = useSearchUsers();
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Filtrer les utilisateurs déjà sélectionnés
    const searchResults = rawResults.filter(
        (user) => !selectedAssignees.some((a) => a.id === user.id)
    );

    // Lancer la recherche quand la valeur débouncée change
    useEffect(() => {
        if (debouncedSearch.length >= 2) {
            searchUsers(debouncedSearch);
        }
    }, [debouncedSearch, searchUsers]);

    // ========================================================================
    // Handlers
    // ========================================================================

    /** Ajoute un utilisateur aux assignés */
    const handleAddAssignee = (user: User) => {
        onAssigneesChange([...selectedAssignees, user]);
        setSearchQuery('');
    };

    /** Retire un utilisateur des assignés */
    const handleRemoveAssignee = (userId: string) => {
        onAssigneesChange(selectedAssignees.filter((a) => a.id !== userId));
    };

    /** Texte affiché dans le bouton */
    const getDisplayText = () => {
        if (selectedAssignees.length === 0) return 'Sélectionner des assignés...';
        if (selectedAssignees.length === 1) {
            return selectedAssignees[0].name || selectedAssignees[0].email;
        }
        return `${selectedAssignees.length} personnes assignées`;
    };

    // ========================================================================
    // Rendu
    // ========================================================================

    return (
        <div className="relative">
            <label id={labelId} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setShowDropdown(!showDropdown);
                    }
                    if (e.key === 'Escape' && showDropdown) {
                        setShowDropdown(false);
                    }
                }}
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
                aria-labelledby={labelId}
                className="dropdown-trigger"
            >
                <span className={selectedAssignees.length > 0 ? 'text-gray-900 truncate' : 'text-gray-500'}>
                    {getDisplayText()}
                </span>
                <Image
                    src="/dropdown.png"
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden="true"
                    className={`shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div 
                    role="listbox"
                    aria-label="Sélection d'assignés"
                    className="dropdown-menu"
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setShowDropdown(false);
                        }
                    }}
                >
                    {/* Recherche */}
                    <div className="p-2 border-b border-gray-100">
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou email..."
                            aria-label="Rechercher un utilisateur par nom ou email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input-search w-full"
                            autoFocus
                        />
                    </div>

                    {/* Sélectionnés */}
                    {selectedAssignees.length > 0 && (
                        <div className="p-2 border-b border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">Sélectionnés :</p>
                            <div className="flex flex-wrap gap-1">
                                {selectedAssignees.map((user) => (
                                    <span key={user.id} className="badge">
                                        {user.name || user.email}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAssignee(user.id)}
                                            aria-label={`Retirer ${user.name || user.email}`}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Résultats de recherche */}
                    <div className="max-h-40 overflow-y-auto" role="group" aria-label="Résultats de recherche">
                        {isSearching ? (
                            <p className="p-3 text-sm text-gray-500 text-center" aria-live="polite">Recherche...</p>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    role="option"
                                    aria-selected="false"
                                    onClick={() => handleAddAssignee(user)}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2"
                                >
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                        {(user.name || user.email).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'Sans nom'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </button>
                            ))
                        ) : searchQuery.length >= 2 ? (
                            <p className="p-3 text-sm text-gray-500 text-center">Aucun résultat</p>
                        ) : (
                            <p className="p-3 text-sm text-gray-500 text-center">Tapez au moins 2 caractères</p>
                        )}
                    </div>

                    {/* Bouton fermer */}
                    <div className="p-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setShowDropdown(false)}
                            className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
