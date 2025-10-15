import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Character {
  id: number;
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  defense: number;
  image: string;
  isEnemy?: boolean;
}

interface Weapon {
  id: number;
  name: string;
  damage: number;
  icon: string;
}

const weapons: Weapon[] = [
  { id: 1, name: 'Темный меч', damage: 25, icon: 'Sword' },
  { id: 2, name: 'Мистический посох', damage: 30, icon: 'Wand2' },
  { id: 3, name: 'Кинжал теней', damage: 20, icon: 'Dagger' }
];

const initialCharacters: Character[] = [
  {
    id: 1,
    name: 'Темный воин',
    health: 100,
    maxHealth: 100,
    damage: 15,
    defense: 10,
    image: 'https://v3b.fal.media/files/b/panda/1l-zs1hKQ5uEg93v-Hacc_output.png'
  },
  {
    id: 2,
    name: 'Мистический маг',
    health: 80,
    maxHealth: 80,
    damage: 25,
    defense: 5,
    image: 'https://v3b.fal.media/files/b/panda/1l-zs1hKQ5uEg93v-Hacc_output.png'
  },
  {
    id: 3,
    name: 'Теневой ассасин',
    health: 90,
    maxHealth: 90,
    damage: 20,
    defense: 8,
    image: 'https://v3b.fal.media/files/b/panda/1l-zs1hKQ5uEg93v-Hacc_output.png'
  }
];

const enemies: Character[] = [
  {
    id: 101,
    name: 'Проклятый страж',
    health: 120,
    maxHealth: 120,
    damage: 18,
    defense: 12,
    image: 'https://v3b.fal.media/files/b/panda/1l-zs1hKQ5uEg93v-Hacc_output.png',
    isEnemy: true
  },
  {
    id: 102,
    name: 'Демон бездны',
    health: 150,
    maxHealth: 150,
    damage: 22,
    defense: 15,
    image: 'https://v3b.fal.media/files/b/panda/1l-zs1hKQ5uEg93v-Hacc_output.png',
    isEnemy: true
  }
];

const Index = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'characters' | 'battle'>('home');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [currentEnemy, setCurrentEnemy] = useState<Character | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);

  const startBattle = (character: Character, weapon: Weapon) => {
    setSelectedCharacter(character);
    setSelectedWeapon(weapon);
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    setCurrentEnemy(randomEnemy);
    setPlayerHealth(character.maxHealth);
    setEnemyHealth(randomEnemy.maxHealth);
    setBattleLog([`Битва началась! ${character.name} против ${randomEnemy.name}`]);
    setActiveSection('battle');
  };

  const attack = () => {
    if (!selectedCharacter || !selectedWeapon || !currentEnemy) return;

    const playerDamage = selectedCharacter.damage + selectedWeapon.damage;
    const enemyDamage = currentEnemy.damage;

    const newEnemyHealth = Math.max(0, enemyHealth - playerDamage);
    setEnemyHealth(newEnemyHealth);
    setBattleLog(prev => [...prev, `Вы нанесли ${playerDamage} урона!`]);

    if (newEnemyHealth <= 0) {
      setBattleLog(prev => [...prev, '🎉 Победа! Враг повержен!']);
      setTimeout(() => setActiveSection('characters'), 2000);
      return;
    }

    setTimeout(() => {
      const newPlayerHealth = Math.max(0, playerHealth - enemyDamage);
      setPlayerHealth(newPlayerHealth);
      setBattleLog(prev => [...prev, `Враг нанес ${enemyDamage} урона!`]);

      if (newPlayerHealth <= 0) {
        setBattleLog(prev => [...prev, '💀 Поражение... Попробуй снова!']);
        setTimeout(() => setActiveSection('characters'), 2000);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary animate-glow-pulse">FORSAKEN</h1>
            <div className="flex gap-4">
              <Button
                variant={activeSection === 'home' ? 'default' : 'outline'}
                onClick={() => setActiveSection('home')}
                className="shadow-glow"
              >
                <Icon name="Home" className="mr-2 h-4 w-4" />
                Главная
              </Button>
              <Button
                variant={activeSection === 'characters' ? 'default' : 'outline'}
                onClick={() => setActiveSection('characters')}
                className="shadow-glow"
              >
                <Icon name="Users" className="mr-2 h-4 w-4" />
                Персонажи
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {activeSection === 'home' && (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center space-y-6">
              <h2 className="text-6xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent animate-float">
                Добро пожаловать в FORSAKEN
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Погрузись в мрачный мир, где каждое сражение - это борьба за выживание.
                Выбери своего героя и докажи свою силу в битве с темными силами.
              </p>
              <Button 
                size="lg" 
                onClick={() => setActiveSection('characters')}
                className="shadow-glow-lg text-lg px-8 py-6"
              >
                <Icon name="Swords" className="mr-2 h-6 w-6" />
                Начать приключение
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 bg-card/80 backdrop-blur border-primary/20 hover:border-primary/50 transition-all hover:shadow-glow">
                <Icon name="Shield" className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Уникальные персонажи</h3>
                <p className="text-muted-foreground">
                  Каждый герой обладает уникальными характеристиками и способностями
                </p>
              </Card>
              <Card className="p-6 bg-card/80 backdrop-blur border-primary/20 hover:border-primary/50 transition-all hover:shadow-glow">
                <Icon name="Swords" className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Эпические битвы</h3>
                <p className="text-muted-foreground">
                  Сражайся с могущественными врагами в динамичных боях
                </p>
              </Card>
              <Card className="p-6 bg-card/80 backdrop-blur border-primary/20 hover:border-primary/50 transition-all hover:shadow-glow">
                <Icon name="Zap" className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Мощное оружие</h3>
                <p className="text-muted-foreground">
                  Выбирай из арсенала смертоносного оружия для победы
                </p>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'characters' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Выбери своего героя</h2>
              <p className="text-muted-foreground">Изучи характеристики и выбери оружие для битвы</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {initialCharacters.map((character) => (
                <Card key={character.id} className="overflow-hidden bg-card/80 backdrop-blur border-primary/20 hover:border-primary/50 transition-all hover:shadow-glow">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary overflow-hidden">
                    <img 
                      src={character.image} 
                      alt={character.name}
                      className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold">{character.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Здоровье</span>
                        <span className="font-bold">{character.maxHealth}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Урон</span>
                        <span className="font-bold text-destructive">{character.damage}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Защита</span>
                        <span className="font-bold text-primary">{character.defense}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Выбери оружие:</p>
                      <div className="space-y-2">
                        {weapons.map((weapon) => (
                          <Button
                            key={weapon.id}
                            variant="outline"
                            className="w-full justify-start border-primary/30 hover:bg-primary/20"
                            onClick={() => startBattle(character, weapon)}
                          >
                            <Icon name={weapon.icon as any} className="mr-2 h-4 w-4" />
                            {weapon.name} (+{weapon.damage} урона)
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'battle' && selectedCharacter && currentEnemy && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">Поле боя</h2>
              <p className="text-muted-foreground">{selectedCharacter.name} vs {currentEnemy.name}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 bg-card/80 backdrop-blur border-primary/50 shadow-glow">
                <div className="text-center space-y-4">
                  <Icon name="User" className="h-16 w-16 mx-auto text-primary" />
                  <h3 className="text-2xl font-bold">{selectedCharacter.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Здоровье</span>
                      <span className="font-bold">{playerHealth}/{selectedCharacter.maxHealth}</span>
                    </div>
                    <Progress value={(playerHealth / selectedCharacter.maxHealth) * 100} className="h-4" />
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <span>Оружие:</span>
                    <span className="font-bold text-primary">{selectedWeapon?.name}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/80 backdrop-blur border-destructive/50 shadow-glow">
                <div className="text-center space-y-4">
                  <Icon name="Skull" className="h-16 w-16 mx-auto text-destructive" />
                  <h3 className="text-2xl font-bold">{currentEnemy.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Здоровье</span>
                      <span className="font-bold">{enemyHealth}/{currentEnemy.maxHealth}</span>
                    </div>
                    <Progress value={(enemyHealth / currentEnemy.maxHealth) * 100} className="h-4" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={attack}
                disabled={playerHealth <= 0 || enemyHealth <= 0}
                className="shadow-glow-lg"
              >
                <Icon name="Swords" className="mr-2 h-5 w-5" />
                Атаковать
              </Button>
            </div>

            <Card className="p-6 bg-card/50 backdrop-blur max-h-64 overflow-y-auto">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Icon name="ScrollText" className="h-5 w-5" />
                Лог битвы
              </h3>
              <div className="space-y-2">
                {battleLog.map((log, index) => (
                  <p key={index} className="text-sm text-muted-foreground animate-fade-in">
                    {log}
                  </p>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 FORSAKEN. Погрузись в тьму и стань легендой.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;