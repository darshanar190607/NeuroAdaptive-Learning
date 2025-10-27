import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ClockIcon, YouTubeIcon } from './Icons';
import { OpticsAnimation } from './OpticsAnimation';

// --- ICONS ---
const ArrowDownIcon: React.FC = () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;
const GenerateIcon: React.FC<{className?: string}> = ({className}) => <svg className={`w-5 h-5 mr-2 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636 4.364l.707.707M6.343 6.343l-.707-.707m12.728 0l.707-.707"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z"></path></svg>;
const RefreshIcon: React.FC = () => <svg className="w-5 h-5 text-gray-400 hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 9a9 9 0 0114.65-4.65L20 5M20 15a9 9 0 01-14.65 4.65L4 19"></path></svg>;
const BookIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const CubeIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const ComicIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 12.5c0-6.5-4-9-4.5-9-1-.5-2 1-3 2-2 2-5 2-7 0-1-1-2.5-2.5-3.5-2-1.5 1-4.5 4-4.5 9.5s4.5 9.5 11 9.5 11-3 11-9.5z"></path></svg>;
const TrophyIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>;
const CardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const LockIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const CheckIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;


// --- TYPES ---
type View = 'INPUT' | 'OUTLINE' | 'CONTENT_HUB' | 'QUIZ' | 'PROJECT' | 'CERTIFICATE';
type LearningMode = 'STATIC_READING' | '3D_VISUALS' | 'COMIC' | 'VIDEO';
type OutlineItem = { id: number; title: string; points: string[]; };
type QuizQuestion = { question: string; options: string[]; answer: string; };
type Round = { id: number; status: 'locked' | 'unlocked' | 'completed'; difficulty: 'easy' | 'medium' | 'hard'; score?: number; };
type RewardCard = { name: string; description: string; imageUrl: string; };
type Visual3DContent = { type: 'gsap' } | { type: 'embed'; url: string; };


const TOTAL_ROUNDS = 3;

const CourseChat: React.FC = () => {
    const [view, setView] = useState<View>('INPUT');
    const [topic, setTopic] = useState('');
    const [outline, setOutline] = useState<OutlineItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Generating...');
    const [error, setError] = useState<string | null>(null);
    const [recommendedTime, setRecommendedTime] = useState('');
    const [studyTime, setStudyTime] = useState('');

    // Content State
    const [staticContent, setStaticContent] = useState('');
    const [visual3DContent, setVisual3DContent] = useState<Visual3DContent | null>(null);
    const [comicImageUrl, setComicImageUrl] = useState<string | null>(null);
    const [videoIds, setVideoIds] = useState<string[]>([]);
    const [activeContentMode, setActiveContentMode] = useState<LearningMode | null>(null);


    // Gamification State
    const [rounds, setRounds] = useState<Round[]>(
        Array.from({ length: TOTAL_ROUNDS }, (_, i) => ({ id: i + 1, status: 'locked', difficulty: i === 0 ? 'easy' : i === 1 ? 'medium' : 'hard' }))
    );
    const [currentRound, setCurrentRound] = useState<number>(1);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [quizResult, setQuizResult] = useState<{ score: number; correct: number; total: number } | null>(null);
    const [points, setPoints] = useState(0);
    const [collectedCards, setCollectedCards] = useState<RewardCard[]>([]);
    const [learningPace, setLearningPace] = useState<string>('');
    const [projectContent, setProjectContent] = useState('');
    const [certificateContent, setCertificateContent] = useState('');


    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const handleGenerateOutline = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        setLoadingMessage('Generating initial outline...');
        setError(null);
        setOutline(null);

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate a detailed course outline for the topic: "${topic}". Provide about 5-7 main topics. Each topic should have a title and a few bullet points. Also provide a recommended total study time (e.g., "4 hours").`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            courseTitle: { type: Type.STRING },
                            recommendedStudyTime: { type: Type.STRING },
                            outline: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: { title: { type: Type.STRING }, points: { type: Type.ARRAY, items: { type: Type.STRING } } },
                                    required: ['title', 'points']
                                }
                            }
                        },
                        required: ['courseTitle', 'outline', 'recommendedStudyTime']
                    }
                }
            });

            const jsonResponse = JSON.parse(response.text);
            const outlineWithIds = jsonResponse.outline.map((item: Omit<OutlineItem, 'id'>, index: number) => ({...item, id: index + 1 }));
            setTopic(jsonResponse.courseTitle);
            setOutline(outlineWithIds);
            setRecommendedTime(jsonResponse.recommendedStudyTime);
            setStudyTime(jsonResponse.recommendedStudyTime);
            setView('OUTLINE');

        } catch (e) {
            console.error(e);
            setError("Failed to generate outline. The model may be unavailable. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFinalizePlan = async () => {
        if (!outline || !studyTime) return;
        setIsLoading(true);
        setLoadingMessage(`Adjusting plan for ${studyTime}...`);
        setError(null);
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `A user wants to learn about "${topic}" in ${studyTime}. The original, ideal outline has these topics: ${JSON.stringify(outline.map(o => o.title))}. Please adjust this outline to fit the specified timeframe. If the time is short, condense it to the most critical topics. If it's long, you can keep the original. Return only the adjusted outline.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                           outline: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: { title: { type: Type.STRING }, points: { type: Type.ARRAY, items: { type: Type.STRING } } },
                                    required: ['title', 'points']
                                }
                            }
                        },
                        required: ['outline']
                    }
                }
            });
            const jsonResponse = JSON.parse(response.text);
            const newOutline = jsonResponse.outline.map((item: Omit<OutlineItem, 'id'>, index: number) => ({...item, id: index + 1 }));
            setOutline(newOutline);
            setRounds(prev => prev.map((r, i) => ({ ...r, status: i === 0 ? 'unlocked' : 'locked' })));
            setView('CONTENT_HUB');
        } catch(e) {
            console.error(e);
            setError("Failed to adjust the plan. Starting with the original outline.");
            setView('CONTENT_HUB');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOutlineChange = (id: number, field: 'title' | 'points', value: string) => {
        if (!outline) return;
        const newOutline = outline.map(item => {
            if (item.id === id) {
                return field === 'title' ? { ...item, title: value } : { ...item, points: value.split('\n') };
            }
            return item;
        });
        setOutline(newOutline);
    };

    const handleSelectContentMode = async (mode: LearningMode) => {
        setActiveContentMode(mode);
        setIsLoading(true);
        setLoadingMessage(`Fetching ${mode.replace('_', ' ')}...`);
        setError(null);
    
        try {
            switch(mode) {
                case 'STATIC_READING':
                    if (staticContent) break;
                    const responseStyle = {
                        tone: "natural and human-like",
                        formality: "medium",
                        structure: "well-formed paragraphs with smooth transitions; avoid bullet points unless needed",
                        content_focus: "clear conceptual explanation with natural flow, mild creativity, and simple relatable examples",
                        avoid: [
                            "markdown symbols (#, *, -, etc.)",
                            "rigid structure or overly formatted text",
                            "AI-like repetition or symmetry in every paragraph",
                            "robotic tone or phrases like 'Definition:' or 'Explanation:'"
                        ],
                        include: [
                            "transitional connectors such as 'In simple terms', 'For instance', 'You can think of it as'",
                            "natural variation in sentence length and structure",
                            "occasional everyday examples or comparisons to aid understanding"
                        ],
                        length_guideline: "moderate; detailed enough for understanding but concise enough to stay engaging",
                        goal: "make the output sound like it was written by a human teacher or student with good clarity and flow, not a machine."
                    };
                    const staticRes = await ai.models.generateContent({ 
                        model: 'gemini-2.5-flash', 
                        contents: `Provide a summary of the key concepts for a course on "${topic}". Cover these topics: ${outline?.map(o=>o.title).join(', ')}. Please write the content following these style guidelines precisely: ${JSON.stringify(responseStyle)}` 
                    });
                    setStaticContent(staticRes.text);
                    break;
    
                case '3D_VISUALS':
                    if (visual3DContent) break;
                    if (topic.toLowerCase().includes('optics')) {
                        setVisual3DContent({ type: 'gsap' });
                    } else {
                        const searchRes = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Find a public, embeddable 3D model URL from Sketchfab for the topic "${topic}". Return just the URL.`, config: { tools: [{ googleSearch: {} }] } });
                        const url = searchRes.text.trim();
                         if (url && url.startsWith('http')) {
                            setVisual3DContent({ type: 'embed', url });
                        } else {
                             throw new Error("No embeddable model found.");
                        }
                    }
                    break;
    
                case 'COMIC':
                    if (comicImageUrl) break;
                    const storyRes = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Create a simple, clear concept for a single-panel educational comic about "${topic}". Describe the scene, characters, and any text bubbles for an image generation AI. The style should be fun and informative.` });
                    const imageRes = await ai.models.generateContent({ model: 'gemini-2.5-flash-image', contents: { parts: [{ text: `Generate a comic-style image based on this description: ${storyRes.text}` }] }, config: { responseModalities: [Modality.IMAGE] } });
                    const base64Image = imageRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                    if (base64Image) {
                         setComicImageUrl(`data:image/png;base64,${base64Image}`);
                    } else {
                        throw new Error("Failed to generate comic image.");
                    }
                    break;
    
                case 'VIDEO':
                    if (videoIds.length > 0) break;
                    const videoRes = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Find 3 relevant YouTube video URLs for a beginner learning about "${topic}". Return only a comma-separated list of the full URLs.`, config: { tools: [{ googleSearch: {} }] } });
                    const urls = videoRes.text.split(',').map(url => url.trim());
                    const ids = urls.map(url => url.split('v=')[1]?.split('&')[0]).filter(Boolean);
                    setVideoIds(ids);
                    break;
            }
        } catch (e) {
            console.error(`Failed to load ${mode}`, e);
            setError(`Could not load content for ${mode}. Please try another option.`);
            setActiveContentMode(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    const generateRewardCard = async () => {
        setLoadingMessage('Forging your reward...');
        setIsLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `For a learning app, generate data for a collectible reward card.
Topic: "${topic}"
Achievement: "Mastery Round ${currentRound}"

Tasks:
1. Write a short, epic description for this card.
2. Use Google Search to find a URL for a high-quality, fitting fantasy or sci-fi image.

Respond with ONLY a valid JSON object string with the keys "description" and "imageUrl". Do not include any other text or markdown formatting.
Example format:
{"description": "Your description here", "imageUrl": "http://example.com/image.jpg"}`,
                config: {
                    tools: [{ googleSearch: {} }],
                }
            });
            let jsonText = response.text;
            // Clean up potential markdown formatting
            const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
                jsonText = jsonMatch[1];
            }
            jsonText = jsonText.trim();

            const cardData = JSON.parse(jsonText);
            const newCard: RewardCard = {
                name: `${topic} - Mastery ${currentRound}`,
                description: cardData.description,
                imageUrl: cardData.imageUrl || `https://picsum.photos/seed/${topic}${currentRound}/400/600`
            };
            setCollectedCards(prev => [...prev, newCard]);
        } catch (e) {
            console.error("Failed to generate reward card:", e);
            const fallbackCard: RewardCard = {
                name: `${topic} - Mastery ${currentRound}`,
                description: `You have shown great skill in the subject of ${topic}, conquering the challenges of round ${currentRound}.`,
                imageUrl: `https://picsum.photos/seed/${topic}${currentRound}/400/600`
            };
            setCollectedCards(prev => [...prev, fallbackCard]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartQuiz = async () => {
        setIsLoading(true);
        setLoadingMessage(`Generating ${rounds.find(r=>r.id===currentRound)?.difficulty} quiz...`);
        try {
             const difficulty = rounds.find(r => r.id === currentRound)?.difficulty || 'easy';
             const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate a 5-question multiple-choice quiz about the entire course: "${topic}". The questions should be of ${difficulty} difficulty. For each question, provide 4 options and specify the correct answer.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            questions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        question: { type: Type.STRING },
                                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        answer: { type: Type.STRING }
                                    },
                                    required: ['question', 'options', 'answer']
                                }
                            }
                        },
                        required: ['questions']
                    }
                }
            });
            const quizData = JSON.parse(response.text);
            setQuizQuestions(quizData.questions);
            setUserAnswers(new Array(quizData.questions.length).fill(''));
            setQuizResult(null);
            setView('QUIZ');
        } catch (e) {
            console.error("Failed to start quiz", e);
            setError("Could not generate the quiz. Please go back and try again.");
            setView('CONTENT_HUB');
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmitQuiz = async () => {
        let correctCount = 0;
        quizQuestions.forEach((q, index) => { if (userAnswers[index] === q.answer) correctCount++; });
        const score = Math.round((correctCount / quizQuestions.length) * 100);
        setQuizResult({ score, correct: correctCount, total: quizQuestions.length });

        if (score >= 60) {
            const roundIndex = rounds.findIndex(r => r.id === currentRound);
            const newRounds = [...rounds];
            newRounds[roundIndex] = { ...newRounds[roundIndex], status: 'completed', score };
            setPoints(prev => prev + (100 * (roundIndex + 1)));
            await generateRewardCard();
            if (currentRound < TOTAL_ROUNDS) {
                newRounds[roundIndex + 1] = { ...newRounds[roundIndex + 1], status: 'unlocked' };
            }
            setRounds(newRounds);
        }
    };
    
    const predictLearningPace = async () => {
        if (learningPace) return;
        setIsLoading(true);
        setLoadingMessage('Analyzing your performance...');
        try {
            const scoresText = rounds.map(r => `Round ${r.id} (${r.difficulty}): ${r.score || 0}%`).join(', ');
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Analyze a student's quiz scores for "${topic}". Scores: ${scoresText}. Provide a one-sentence analysis of their learning pace (e.g., "You're a quick study, grasping concepts rapidly!" or "You build knowledge steadily and methodically, ensuring a strong foundation.").`
            });
            setLearningPace(response.text);
        } catch(e) { console.error("Failed to predict learning pace", e); setLearningPace("You've successfully completed the course!"); } finally { setIsLoading(false); }
    };

    const handleGoToNextRound = async () => {
        if(currentRound < TOTAL_ROUNDS) {
            setCurrentRound(prev => prev + 1);
            setQuizResult(null);
            setView('CONTENT_HUB'); // Go back to content hub before next quiz
        } else {
             await predictLearningPace();
             setView('PROJECT');
        }
    };

    // --- RENDER VIEWS ---

    const renderInputView = () => (
        <div className="w-full max-w-3xl mx-auto p-8 rounded-2xl" style={{background: 'linear-gradient(135deg, #2a4c6a 0%, #1c3349 100%)'}}>
            <form onSubmit={(e) => { e.preventDefault(); handleGenerateOutline(); }} className="space-y-6">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What do you want to learn today?"
                    className="w-full text-center text-xl bg-white/90 text-gray-800 placeholder-gray-500 rounded-lg py-4 px-6 border-2 border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition"
                    aria-label="Course topic input"
                />
                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed">
                    {isLoading ? loadingMessage : <><GenerateIcon className="w-6 h-6"/> Generate outline</>}
                </button>
            </form>
             {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
    );

    const renderOutlineView = () => (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center bg-gray-800/50 border border-gray-700 p-4 rounded-xl shadow-lg mb-6">
                <h1 className="text-2xl font-bold text-white">{topic}</h1>
                <button onClick={handleGenerateOutline} aria-label="Regenerate outline" disabled={isLoading}><RefreshIcon /></button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-400 ml-2">Outline</h2>
                    {outline?.map(item => (
                        <div key={item.id} className="bg-white/10 backdrop-blur-sm border border-gray-700 p-5 rounded-lg shadow-md flex gap-5 items-start">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-md">{item.id}</div>
                            <div className="flex-grow">
                                <input type="text" value={item.title} onChange={(e) => handleOutlineChange(item.id, 'title', e.target.value)} className="w-full bg-transparent text-white font-semibold text-lg border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1" />
                                <textarea value={item.points.join('\n')} onChange={(e) => handleOutlineChange(item.id, 'points', e.target.value)} className="w-full bg-transparent text-gray-300 mt-2 border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 resize-none" rows={item.points.length} />
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="md:col-span-1">
                    <div className="bg-gray-800/50 p-6 rounded-xl sticky top-24">
                        <h2 className="text-lg font-semibold text-gray-200 mb-4">Study Plan</h2>
                        <div className="mb-4">
                            <label className="text-sm text-gray-400">Recommended Time</label>
                            <p className="text-white font-bold text-lg">{recommendedTime}</p>
                        </div>
                        <div>
                             <label htmlFor="studyTime" className="text-sm text-gray-400 flex items-center gap-2"><ClockIcon className="w-4 h-4" /> Your Commitment</label>
                             <input id="studyTime" type="text" value={studyTime} onChange={(e) => setStudyTime(e.target.value)} className="mt-1 w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                         <button onClick={handleFinalizePlan} disabled={isLoading} className="w-full mt-6 bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-700 transition-all transform hover:scale-105 disabled:opacity-50">
                            {isLoading ? loadingMessage : 'Start Learning'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderContentHubView = () => {
         const isQuizUnlocked = rounds.find(r => r.id === currentRound)?.status === 'unlocked';
         return (
            <div className="w-full max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-white">Learning Hub: <span className="text-orange-400">{topic}</span></h2>
                    <div className="text-xl font-bold text-yellow-400">Points: {points}</div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
                        <button onClick={() => handleSelectContentMode('STATIC_READING')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeContentMode === 'STATIC_READING' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}><BookIcon className="text-blue-300"/> Static Content</button>
                        <button onClick={() => handleSelectContentMode('3D_VISUALS')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeContentMode === '3D_VISUALS' ? 'bg-purple-600 text-white' : 'hover:bg-gray-700'}`}><CubeIcon className="text-purple-300"/> 3D Visuals</button>
                        <button onClick={() => handleSelectContentMode('COMIC')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeContentMode === 'COMIC' ? 'bg-pink-600 text-white' : 'hover:bg-gray-700'}`}><ComicIcon className="text-pink-300"/> Comic Style</button>
                        <button onClick={() => handleSelectContentMode('VIDEO')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeContentMode === 'VIDEO' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}><YouTubeIcon className="w-6 h-6 text-red-300"/> Videos</button>
                        <div className="my-2 border-t border-gray-600"></div>
                        <button onClick={handleStartQuiz} disabled={!isQuizUnlocked} className="w-full flex items-center justify-center gap-3 p-4 rounded-lg bg-yellow-600 text-white font-bold hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed">
                            {isQuizUnlocked ? `Start Quiz Round ${currentRound}` : <><LockIcon/> Quiz Locked</>}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 bg-gray-800/50 border border-gray-700 rounded-xl p-6 min-h-[500px] flex justify-center items-center">
                        {isLoading ? <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div><p className="mt-4">{loadingMessage}</p></div> :
                         !activeContentMode ? <p className="text-gray-400">Select a learning mode to begin.</p> :
                         error ? <p className="text-red-400">{error}</p> :
                         <div className="w-full h-full">
                            {activeContentMode === 'STATIC_READING' && <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: staticContent.replace(/\n/g, '<br />') }} />}
                            {activeContentMode === '3D_VISUALS' && visual3DContent?.type === 'gsap' && <OpticsAnimation />}
                            {activeContentMode === '3D_VISUALS' && visual3DContent?.type === 'embed' && <iframe title="3D Model" className="w-full h-full rounded-lg" src={visual3DContent.url}></iframe>}
                            {activeContentMode === 'COMIC' && comicImageUrl && <img src={comicImageUrl} alt="AI Generated Comic" className="max-w-full max-h-[500px] object-contain rounded-lg mx-auto"/>}
                            {activeContentMode === 'VIDEO' && <div className="grid grid-cols-1 gap-4">{videoIds.map(id => <iframe key={id} className="w-full aspect-video rounded-lg" src={`https://www.youtube.com/embed/${id}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>)}</div>}
                         </div>
                        }
                    </div>
                </div>
            </div>
         )
    }
    
    const renderQuizView = () => (
        <div className="w-full max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-extrabold text-white">Quiz - Round {currentRound}</h2></div>
            {quizResult ? (
                <div className="bg-gray-800/70 p-8 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold mb-2">Round {currentRound} {quizResult.score >= 60 ? 'Complete!' : 'Needs Review'}</h3>
                    <p className={`text-5xl font-bold my-4 ${quizResult.score >= 60 ? 'text-green-400' : 'text-red-400'}`}>{quizResult.score}%</p>
                    <p className="text-gray-300">You answered {quizResult.correct} out of {quizResult.total} questions correctly.</p>
                    {quizResult.score >= 60 ? (
                        <div className="mt-6">
                            <p className="text-lg font-semibold text-yellow-400">Rewards Unlocked!</p>
                            <div className="flex justify-center gap-6 mt-2 text-white"><TrophyIcon/> +{100 * currentRound} Points <CardIcon/> New Card Acquired!</div>
                            <button onClick={handleGoToNextRound} className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">
                                {currentRound < TOTAL_ROUNDS ? 'Continue Learning' : 'Go to Final Project!'}
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <p className="text-lg text-gray-300">Review the material and try again!</p>
                             <button onClick={() => setView('CONTENT_HUB')} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
                                Back to Learning Hub
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {quizQuestions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-gray-800/50 p-6 rounded-lg">
                            <p className="font-semibold text-lg text-white mb-4">{qIndex + 1}. {q.question}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {q.options.map((option, oIndex) => (
                                    <button key={oIndex} onClick={() => setUserAnswers(ua => ua.map((a, i) => i === qIndex ? option : a))} className={`p-3 rounded-md text-left transition-all ${userAnswers[qIndex] === option ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>{option}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button onClick={handleSubmitQuiz} disabled={userAnswers.includes('')} className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-500">Submit Answers</button>
                </div>
            )}
        </div>
    );
    
    const renderProjectAndCertificateView = (isCertificate: boolean) => (
        <div className="w-full max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-white mb-4">{isCertificate ? "Certificate of Completion" : "Final Project"}</h2>
            <div className="bg-gray-800/50 border border-yellow-400 rounded-xl p-8 min-h-[300px] flex flex-col justify-center items-center">
                {isLoading ? <p className="text-white">{loadingMessage}</p> : (
                    <>
                        <TrophyIcon />
                        {isCertificate && <p className="mt-4 text-lg text-orange-300 italic">"{learningPace}"</p>}
                        <p className="mt-4 text-lg text-gray-200 whitespace-pre-wrap max-w-3xl">{isCertificate ? certificateContent : projectContent}</p>
                    </>
                )}
            </div>
            {isCertificate && (
                <div className="mt-10">
                    <h3 className="text-2xl font-bold text-white mb-4">Your Reward Collection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {collectedCards.map(card => (
                            <div key={card.name} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden group">
                                <img src={card.imageUrl} alt={card.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" />
                                <div className="p-4"><h4 className="font-bold text-lg text-yellow-400">{card.name}</h4><p className="text-sm text-gray-300 mt-1">{card.description}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             <button onClick={() => { 
                if(isCertificate) {
                    setView('INPUT'); setTopic(''); setOutline(null); setPoints(0); setCollectedCards([]); setLearningPace(''); setActiveContentMode(null); setStaticContent(''); setVisual3DContent(null); setComicImageUrl(null); setVideoIds([]);
                } else {
                    setView('CERTIFICATE');
                }
            }} className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg">
                {isCertificate ? "Start a New Course" : "Mark as Complete & Get Certificate"}
            </button>
        </div>
    );

    useEffect(() => {
        const fetchContent = async () => {
             if (view === 'PROJECT' && !projectContent) {
                 setIsLoading(true); setLoadingMessage('Generating final project...');
                 const res = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: `Generate a simple, real-time project idea for a beginner who just completed a course on "${topic}". Provide a brief, a list of requirements, and a potential challenge.`});
                 setProjectContent(res.text);
                 setIsLoading(false);
            } else if (view === 'CERTIFICATE' && !certificateContent) {
                 setIsLoading(true); setLoadingMessage('Generating your certificate...');
                 const res = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: `Generate a personalized certificate text for a student who completed the course on "${topic}". Mention their achievement and offer one key area for future improvement based on the general challenges of learning this topic.`});
                 setCertificateContent(res.text);
                 setIsLoading(false);
            }
        }
        fetchContent();
    }, [view]);

    return (
        <section className="bg-gray-900 py-16 min-h-[80vh] flex items-center">
            <div className="container mx-auto px-6">
                {view === 'INPUT' && renderInputView()}
                {view === 'OUTLINE' && renderOutlineView()}
                {view === 'CONTENT_HUB' && renderContentHubView()}
                {view === 'QUIZ' && renderQuizView()}
                {view === 'PROJECT' && renderProjectAndCertificateView(false)}
                {view === 'CERTIFICATE' && renderProjectAndCertificateView(true)}
            </div>
        </section>
    );
};

export default CourseChat;