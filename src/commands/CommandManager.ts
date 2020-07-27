import {ICommand} from "./ICommand";

class CommandManager {
    private commands: ICommand[] = [];

    register(command: ICommand): void {
        if(this.commands.includes(command)) {
            console.log(`⚠ Command ${command.name} registered twice.`);
            return;
        }

        this.commands.push(command);
    }

    find(name: string): ICommand {
        return this.commands.find(e => e.name.toLowerCase() === name.toLowerCase() || e.aliases.includes(name.toLowerCase()));
    }
}

export default new CommandManager();