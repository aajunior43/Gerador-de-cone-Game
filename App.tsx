import React, { useState, useCallback } from 'react';
import { generateIcon } from './services/geminiService';
import { ImagePlaceholderIcon, MagicWandIcon, DownloadIcon } from './components/Icons';
import { LoadingAnimation } from './components/LoadingAnimation';

const styles = [
  { name: 'Fantasia', description: 'Estilo de fantasia épica, vibrante, moderno, design arrojado' },
  { name: 'Cyberpunk', description: 'Estilo cyberpunk, neon, futurista, tecnológico, sombrio' },
  { name: 'Minimalista', description: 'Estilo minimalista, limpo, simples, com formas geométricas e cores sólidas' },
  { name: 'Retrô', description: 'Estilo retrô, pixel art, 8-bit, cores vibrantes, nostálgico' },
  { name: 'Sci-Fi', description: 'Estilo Sci-Fi, ficção científica, naves espaciais, tecnologia avançada, cosmos' },
  { name: 'Medieval', description: 'Estilo medieval fantástico, dragões, castelos, espadas, magia antiga' },
  { name: 'Abstrato', description: 'Estilo abstrato, formas orgânicas, cores vibrantes, arte moderna, conceitual' },
];

const App: React.FC = () => {
  const [nickname, setNickname] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Fantasia');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!nickname.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const styleObject = styles.find(s => s.name === selectedStyle);
      if (!styleObject) {
        throw new Error("Estilo selecionado inválido.");
      }
      const imageUrl = await generateIcon(nickname, styleObject.description);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado ao gerar a imagem.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [nickname, isLoading, selectedStyle]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 md:p-10 text-center">
          
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
              Gerador de Ícone Gamer
            </h1>
            <p className="text-slate-400 text-lg">
              Transforme seu nickname em um ícone épico com IA!
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-slate-400 text-sm font-semibold mb-3 text-left">1. Escolha um estilo</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {styles.map((style) => (
                <button
                  key={style.name}
                  onClick={() => setSelectedStyle(style.name)}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-200 disabled:opacity-50 ${
                    selectedStyle === style.name
                      ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
             <label className="block text-slate-400 text-sm font-semibold mb-3 text-left">2. Digite seu nickname</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Seu nickname..."
                disabled={isLoading}
                className="flex-grow bg-slate-900/80 border-2 border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all duration-300 disabled:opacity-50"
                aria-label="Nickname do jogador"
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !nickname.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <MagicWandIcon />
                    Gerar Ícone
                  </>
                )}
              </button>
            </div>
          </div>


          <div className="w-full aspect-square bg-slate-900/70 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
            {isLoading && (
              <div className="flex flex-col items-center gap-6 text-slate-400">
                <LoadingAnimation />
                <p>Criando sua obra-prima...</p>
              </div>
            )}
            {error && (
              <div className="text-red-400 p-4 text-left">
                <p className="font-bold">Oops! Ocorreu um erro.</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
            {generatedImage && (
              <img
                src={generatedImage}
                alt={`Ícone gerado para ${nickname}`}
                className="w-full h-full object-cover animate-fade-in shadow-[4px_4px_8px_rgba(0,0,0,0.2)]"
              />
            )}
            {!isLoading && !error && !generatedImage && (
              <div className="text-slate-600 flex flex-col items-center gap-4">
                <ImagePlaceholderIcon />
                <p>Seu ícone aparecerá aqui</p>
              </div>
            )}
          </div>

          {generatedImage && !isLoading && (
            <div className="mt-6">
              <a
                href={generatedImage}
                download={`icone_${nickname.trim().replace(/\s+/g, '_') || 'gamer'}.png`}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
                aria-label="Baixar o ícone gerado"
              >
                <DownloadIcon />
                Baixar Ícone
              </a>
            </div>
          )}

        </div>
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Powered by Gemini API</p>
        </footer>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
        @keyframes pulse-core {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .animate-pulse-core {
            animation: pulse-core 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-orbit {
            animation: orbit 8s linear infinite;
        }

        .satellite {
            animation: pulse-satellite 2s ease-in-out infinite;
        }

        @keyframes pulse-satellite {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(0.8);
                opacity: 0.7;
            }
        }
      `}</style>
    </div>
  );
};

export default App;