'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

const resumes = [
  {
    filename: 'Farhan_Akhtar_ML_Engineer.pdf',
    title: 'ML Engineer',
    keywords: ['PyTorch', 'Transformers', 'NIT Calicut', 'XGBoost', 'Time Series'],
    color: '#10b981',
  },
  {
    filename: 'Farhan_Akhtar_AI_Engineer.pdf',
    title: 'AI Engineer',
    keywords: ['Agentic AI', 'RAG', 'LLMs', 'LangChain', 'Vector DB'],
    color: '#8b5cf6',
  },
  {
    filename: 'Farhan_Akhtar_GenAI_Engineer.pdf',
    title: 'GenAI Engineer',
    keywords: ['Prompt Eng', 'RAG Agents', 'Fine-Tuning', 'Embeddings', 'NVIDIA'],
    color: '#06b6d4',
  },
  {
    filename: 'Farhan_Akhtar_Agentic_AI_Engineer.pdf',
    title: 'Agentic AI Engineer',
    keywords: ['Multi-Agent', 'AgentOS', 'RAG Pipeline', 'Orchestration', 'LLM'],
    color: '#f59e0b',
  },
];

const atsKeywords = [
  'PyTorch', 'Transformers', 'RAG', 'LangChain', 'Vector DB',
  'Fine-Tuning', 'Agentic AI', 'Multi-Agent', 'NIT Calicut', 'Research',
  'Deep Learning', 'ML', 'Python', 'AWS', 'Prompt Eng',
  'LLM Integration', 'Embeddings', 'Time Series',
];

export default function RecruiterCenterRoom() {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
  });

  return (
    <group>
      {/* Large holographic display */}
      <mesh position={[0, 4, -5]}>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#f59e0b"
          emissiveIntensity={0.16}
        />
      </mesh>

      <Billboard position={[0, 6, -4.8]}>
        <Text fontSize={0.3} color="#f59e0b" anchorX="center" anchorY="middle">
          RECRUITER RESOURCE CENTER
        </Text>
      </Billboard>
      <Billboard position={[0, 5.4, -4.8]}>
        <Text fontSize={0.12} color="#94a3b8" anchorX="center">
          ATS-Optimized Resumes for Specific Roles
        </Text>
      </Billboard>

      {/* 3D document models on a table */}
      <group position={[0, 1, 0]}>
        {/* Table */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8, 0.15, 4]} />
          <meshStandardMaterial color="#111827" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* Resume documents */}
        {resumes.map((resume, i) => {
          const x = -3 + i * 2;
          const angle = -0.15 + i * 0.08;

          return (
            <Float key={resume.filename} speed={0.4} rotationIntensity={0.02} floatIntensity={0.1}>
              <group position={[x, 0.5, 0]} rotation={[0, angle, 0]}>
                {/* Document */}
                <mesh>
                  <boxGeometry args={[1.5, 2, 0.08]} />
                  <meshStandardMaterial
                    color="#f8fafc"
                    emissive={resume.color}
                    emissiveIntensity={0.1}
                    roughness={0.9}
                  />
                </mesh>

                {/* Title on document */}
                <Billboard position={[0, 0.6, 0.06]}>
                  <Text fontSize={0.1} color={resume.color} anchorX="center" maxWidth={1.3}>
                    {resume.title}
                  </Text>
                </Billboard>

                {/* Keywords */}
                <Billboard position={[0, 0.1, 0.06]}>
                  <Text fontSize={0.05} color="#475569" anchorX="center" maxWidth={1.3}>
                    {resume.keywords.join(' · ')}
                  </Text>
                </Billboard>

                {/* Download indicator */}
                <mesh position={[0, -0.7, 0.05]}>
                  <planeGeometry args={[0.8, 0.15]} />
                  <meshBasicMaterial color={resume.color} transparent opacity={0.3} />
                </mesh>
                <Billboard position={[0, -0.7, 0.06]}>
                  <Text fontSize={0.06} color={resume.color} anchorX="center" anchorY="middle">
                    DOWNLOAD PDF
                  </Text>
                </Billboard>
              </group>
            </Float>
          );
        })}
      </group>

      {/* ATS Keyword cloud */}
      <group position={[0, 0.5, 3]}>
        <Billboard position={[0, 0.5, 0]}>
          <Text fontSize={0.1} color="#f59e0b" anchorX="center">
            ATS Keyword Coverage
          </Text>
        </Billboard>

        {atsKeywords.map((kw, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          return (
            <Float key={kw} speed={0.5 + i * 0.05} rotationIntensity={0.05} floatIntensity={0.1}>
              <mesh position={[-2.5 + col * 1, -0.3 - row * 0.4, 0]}>
                <planeGeometry args={[0.9, 0.2]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
              </mesh>
              <Billboard position={[-2.5 + col * 1, -0.3 - row * 0.4, 0.01]}>
                <Text fontSize={0.06} color="#10b981" anchorX="center" anchorY="middle">
                  {kw}
                </Text>
              </Billboard>
            </Float>
          );
        })}
      </group>

      <pointLight position={[0, 5, -3]} color="#f59e0b" intensity={1.5} />
      <pointLight position={[0, 2, 0]} color="#06b6d4" intensity={1.5} />

      <Billboard position={[0, 7.5, 0]}>
        <Text fontSize={0.12} color="#475569" anchorX="center" anchorY="middle">
          ROOM 09 - RECRUITER RESOURCE CENTER
        </Text>
      </Billboard>
    </group>
  );
}
